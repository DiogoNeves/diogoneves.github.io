---
layout: post
title: "Hi There! Little Chatbot"
date: "2015-05-08"
tags:
- ai
- nlp
- experiments
- android
---

### Summary:
* Voice input and NLP service **Wit.ai**  
* Simple conversation mechanics  
* Chatbot on Android with RiveScript  

---
_(This is part of a series of reports on my random experiments)_  

Is this the first post on my new website? WOW it is :thumbsup:.  

Last week I started exploring the different voice and language interfaces and
decided to hack something.  

I've set a simple goal: _"Create an Android application that accepts voice
inputs from the user, about the weather and time, and can ask for any missing
information needed to come up with the answer."_  

Some googling took me to [Wit.ai](https://wit.ai/). What a great service!  
I'll let you see for yourself (the website explains it better than I could), but
this meant the language and voice input of the problem was, partially, solved.  

**Wit.ai** is great but, only solves the first part of the problem, I still had
to work on the conversation bit.

For this I implemented a simple solution (remember, I'm just exploring).  
Wit.ai gives me an intent for the input sentence, here's an example response:
{% highlight json %}
{  
  "entities": [],  
  "confidence": 1,
  "_text": "what's the weather like",
  "intent": "weather",
  "intent_id": "553f8e1b-82c0-4227-bed6-d1f5bc2742a4"
}
{% endhighlight %}

The idea is simple:  

1. Select the best intent and guarantee the confidence is higher than a
threshold  
1. Look for a suitable conversation for the current intent  
1. Keep a conversation state that keeps track of the known facts (I named them
  concepts) so far, including default values for missing facts  
1. If a fact is mandatory and has not yet been provided, ask a question to the
user  
1. Send the response back to Wit.ai  
1. This time, check if the response answers needed facts for the current
conversation  
1. If the answer is completely unrelated, assume it is another conversation  
1. If it answers some but not all facts, keep asking more questions  
1. If we have all the information we need, look for at _Actuator_ that can...
act on this data  

A stupid example of a conversation:  
User: `How's the weather like?`  
App: `Where?`  
User: `London`  
App: `It's sunny in London!`  

To achieve this I created two main interfaces:  

### Conversation:  
{% highlight java %}
/**
 * Interface for conversation modules.
 *
 * The conversation logic should be:
 * 1 - start or update
 * 2 - if no question, get state and perform the action
 * 3 - if question, get question and ask
 * 4 - repeat all
 */
public interface Conversation {
  /**
   * Start a conversation with the given intent.
   * @param intent data to start the conversation.
   */
  public void start(ConversationIntent intent);

  /**
   * Update an on-going conversation with the given intent.
   * This can't be called before start.
   * @param intent data to update the conversation.
   * @return true if the update was successful, false if the intent doesn't make
   * sense in the conversation.
   */
  public boolean update(ConversationIntent intent);

  /**
   * Checks if the conversation module has a question that needs answering
   * before all the data is complete.
   * @return true if it needs to ask a question, false otherwise (or if the
   * conversation didn't start yet).
   */
  public boolean hasQuestion();

  /**
   * Returns the next question to ask.
   * @return next question text.
   */
  public String nextQuestion();

  /**
   * Returns the current conversation state.
   * Usually used when no more questions need to be asked and we want to use
   * the data to plan an action.
   * @return the current conversation state, null if the conversation didn't
   * start yet.
   */
  public ConversationState getState();
}
{% endhighlight %}

### Actuator:  
{% highlight java %}
public interface Actuator {
  /**
   * Check if this Actuator can act on this conversation.
   * @param state Conversation state to check.
   * @return true if it can act.
   */
  public boolean canActOn(ConversationState state);

  /**
   * Act on a conversation state.
   * @param state conversation to act upon.
   * @return the result of the action.
   */
  public ActionResult actOn(ConversationState state);
}
{% endhighlight %}

There is also a Conversation factory that, based on the intent, will create the
right conversation object or return null if none can be found.  

---

Pretty soon I realised this wasn't going to cut it. I was basically creating a
very confusing and hard to manage chatbot... I like Wit.ai and all the
flexibility you get from it, but I need to explore the conversation side of it.  

I'm now replacing the conversations with a standard chatbot implementation.  
After some research I ended up more confused than not. There are more chat
scripts, markup languages, etc. than I could image. In the end I chose to give
[RiveScript](http://www.rivescript.com/) a trial.  

I couldn't find any Android implementation, but there was a Java one (yes!).  
(To help future developers, I submitted an already accepted pull request to
build packages you can use on your applications).  

So far I only got to the point where I can run the sample scripts on my
application.  

I didn't find any show-stoppers on Android but I had to use my own file loading
logic.  
For simplicity, I added all the required files to the `assets` folder and
instead of relying on RiveScript's loading methods, I've loaded the script
contents myself and _streamed_ the results.  

Here's the main initialisation code required (note: I'm new to Java and this is
an experiment, comments on how to improve the loading are very welcome):  
{% highlight java %}
// (...) somewhere in your Activity
RiveScript scriptEngine;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    // No point setting to true since it prints debug info to System.out
    boolean debug = false;
    scriptEngine = new RiveScript(false);
    scriptEngine.setHandler("perl", new com.rivescript.lang.Perl(scriptEngine,
            "assets/lang/rsp4j.pl"));

    tryLoadScripts();
}

private void tryLoadScripts() {
    try {
        loadScripts();
    } catch (IOException e) {
        Log.e("conversation", "Failed to load scripts directory");
    }
}

private void loadScripts() throws IOException {
    // Aiden is where all the scripts are
    final String directory = "Aiden";

    AssetManager assets = getAssets();
    for (String filename : assets.list(directory)) {
        Log.d("conversation", "Loading " + filename);

        final String path = String.format("%s/%s", directory, filename);
        InputStream scriptStream = assets.open(path);
        loadScript(scriptStream);
        scriptStream.close();
    }
    scriptEngine.sortReplies();
}

private void loadScript(InputStream stream) throws IOException {
    InputStreamReader streamReader = new InputStreamReader(stream);
    BufferedReader reader = new BufferedReader(streamReader);

    StringBuilder content = new StringBuilder();
    String line = reader.readLine();
    while (line != null) {
        content.append(line);
        content.append("\n");
        line = reader.readLine();
    }

    reader.close();
    streamReader.close();

    // This is the trick to add the script to RiveScript engine
    scriptEngine.stream(content.toString());
}
{% endhighlight %}

The goal going forward is to:  

* Use Android _Speech-to-text_ capabilities and interface with the conversation
scripts using voice.  
* Convert the Actuators into a simple reflex agent that can decide what action
to execute based on the current conversation state.  

---

I hope any information on this page is of any help to anyone...  

To be honest, my goal here really was to start writing and stop just talking
about it. I recognise this one is very bland and directionless... but better
ones will come :smile:.

Have a great day!  

---
