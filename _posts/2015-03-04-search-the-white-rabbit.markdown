---
layout: post
title: "Search the White Rabbit"
date: "2015-03-04"
---


“*Trinity: Follow the white rabbit… Knock, knock, Neo*.” [0]

<iframe src="https://trinket.io/embed/python/f6ab9f296a" width="100%" height="400" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>

That’s all good and well, but what’s the path? What are the actions you must
take to find the White Rabbit?

This tutorial hopes to make it a little easier to find the path.  
Unfortunately a path can have quite a few meanings. We are going to focus on
*sequence of actions* in *Classic Planning and Search Algorithms*.

This is an introductory tutorial and will touch the subjects:  

* Depth First Search (DFS)  
* Breadth First Search (BFS)  
* Uniform Cost Search (UCS)  
* A*  
* Simple Heuristic Design and Debug (with A*)  

We will achieve just that with a visual and practical approach
(I may write a more math oriented post another time).  
We’ll be using Python to solve two (and a half) problems:

* Simple Maze (just find the exit)  
* *Simple-ish* Maze (there are slow paths too, hence the “half problem”)  
* 8-Puzzle

I’ve created the tutorial so you can quickly try things out too instead of just
consuming theory or look at random lines of code.  
Everyone has a different learning style so, feel free to just follow the
tutorial or stop and try the exercises (not many I promise).

Some notes if you’re already familiar with search.  
I’m currently following the BerkeleyX Intro to AI [add link] and some of the
terminology is based on the material of the course and
*Artificial Intelligence: A Modern Approach*[1].  
If something isn’t clear, feel free to send suggestions or just plain
(constructive) criticism to diogo.neves@gmail.com

Ok, enough of introductions. Let’s start!

-----

**Search:** Given a well defined problem, search is the process which will
find a discrete sequence of actions from the starting state to the goal.

To put it simply, when you know where you are, where you want to go, but
have no idea how to get there, search algorithms are there for you.

Search has many applications, from route finding to protein design.  
We’re going to focus on two simpler problems today and we’re going to start
by finding our way around a maze.


-----

**The Maze**

I’m not going to go into the details of displaying a maze in the web browser.
If you want a peek at hacky code, find it here [2] \ [link to github project].

We’re going to focus on defining the problem and designing and
implementing a solution.

**The Problem**:

[Insert picture of the Maze]

Ada, our main character, is having a bad dream. She’s stuck in a Maze and
unless she finds a way out, she’ll be there forever!

How do we go about solving this? First good practice is to put yourself
in the character’s mind.  
Imagine yourself in the Maze, looking at a map. How would you find the exit?
If you’re anything like me, you use your index finger and follow a path,
that looks reasonable (more on heuristics later), until you get stuck and go
back the same way.  
You keep trying different paths until you find the one that leads to the end.  
Well, guess what! That’s what a search algorithm does, in general.

Unfortunately, follow the index finger on a reasonable path isn’t a valid
Python statement, so… we’ll have to be a little bit more formal and objective.

*Search Problems* are defined by a **initial state**, **possible actions**,
**a transition model**, **a goal** and the **path cost**.  
Problem definitions are always an abstract representation of the real world.  
In our Maze we don’t care about the thickness of a wall or colour. We also
represent it as a grid (all walls are either parallel or perpendicular
  to each other). When we move, we ignore the details of actually moving, too.  
Again, this is similar to how we do *index finger navigation*. You don’t
think about left foot, right foot when looking at a map.  
We are looking for the simplest representation we can get by with.

This simplified version of the world can be represented as a **state space**.
It is a graph of all possible states (nodes) connected by the actions (edges)
that connect them (take you from A to B).

[image of a simple 2 x 2 maze state space]

Let’s now formally define our problem:

**States:** Here we ask ourselves, what are the variables that change as we
progress? The Maze size is static. The map too. The only variable we need to
keep track of is Ada’s position.
For a Maze of size *N x M*, thus our state space has size *NM* (one variable
  or possible value per position).  
We choose to represent it as a tuple of (x, y) integer values.  
The top left position has the value of (1, 1) and the bottom right (N, M).

**Initial State:** Any position provided it isn’t a wall.

**Actions:** What can we do in this environment? *UP*, *DOWN*, *LEFT*, *RIGHT*.

**Transition Model:** This is where we describe how actions affect states.
In our problem, unless a wall is blocking the path, actions move Ada in the
expected direction, independently of where she was facing previously.

**Goal Test:** How do we know we’ve arrived at an exit? When Ada is at the
pre-defined goal position.

**Path Cost:** Each step costs 1 energy unit.

Our objective is to find a path in the simplified **state space (graph)**
that leads to an exit, not in the actual Maze. This distinction is very
important when solving problems that don’t involve positions or mazes at all
(don’t let the word *path* distract you, maybe we should stick with
  *sequence of actions*).

It helps to translate our visual perception into the abstract graph
representation, closer to what code will “see”.

[insert img of 2x2 maze] / [insert img of graph (including the tuples in
  the nodes)]


OK! We got enough definitions for the moment. How do we go about
finding a solution?  
Before we can even attempt to emulate our *index finger search*, we have to
look at simpler approaches (but equally powerful depending on what
  you’re solving).

What’s the simplest thing you could do? When given a choice, always look at
the states following the same action choice order (always try left first, for
  example), unless you already tried that path.  
That algorithm goes by the name of *Depth First Search (DFS)*.

Assume our action preferred order is [*LEFT*, *UP*, *RIGHT*, *DOWN*].  
Here’s what you do:

1. Starting at the **initial state**, add a mental note of all the possible
actions you can take now (all the paths you could explore), but go *LEFT* first.  
1. You’re at the position to the left, repeat the same process until you find
the goal or a dead-end.  
1. If you find a dead-end, go back to previous mental note, choose the next
direction and completely discard the bad path.  
1. When you finish, write down the sequence of actions that took you to the
goal, not including the ones that led you to a dead-end.  

Sounds simple and we don’t have to keep much in mind (memory).

This process of keeping a “mental note” of what you’re exploring is
represented by a **search tree**.  
**Search trees** differ from the **state space** representation in a subtle,
but very important detail.  
They represent the *state of your search* not the *state of the world*.
So, in our case, it would contain the same states as the **state space**, but
these could be repeated multiple times. What this means is, as we progress in
the search, we may have to consider the same position twice, while **following
different paths**. Since the **search tree** represents our **current
search state**[3], we add a different node, with different parameters to it.  
Consider a Maze with only two positions, but you can keep switching
between them.  
The **state space** has two nodes and two actions, the **search tree** has
infinite depth. When you switch to from the *left* to *right* positions, what
the node in the tree represents is exactly that: The action of going *right*
and the new state you’re in, and going *right **after** going left* is a
different  search state than going *right when you started*. This is your
mental model of all the paths you are considering or have considered. The same
position could thus be in different paths.

[Image of simple index finger DFS on the graph not maze and search tree]

Here’s the pseudo-code for DFS:  
[pseudo-code by me]  
Instead of *mental notes*, we add to the **fringe**, but the concept is the
same. The **fringe** is a stack where we keep all the other paths we can
explore, if we come by a dead-end.  
We use a *Stack* because we always want to continue from the last path we’ve
been exploring.  
We also need to keep track of the nodes we already visited (popped from
  the **fringe**) so we don’t get stuck in a loop, visiting the same path over
  and over.

Now the interesting bit, let’s convert this into Python code!  
In this first iteration, we’ll come up with a simple implementation.
It won’t be great but we’ll improve soon.  
I recommend you stop reading at this point and try to write the
function yourself.  
It takes as arguments:  
**initial_state**: Ada’s initial position (x, y).  
**goal**: The position of the exit (x, y).  

[code editor, include some code tips like the fringe already created and the
loop? Maybe allow to go “next” and the system will fill some code until
complete. At least a dict with the action names and movement deltas]

It may result in a weird path, but it works! It finds a path!

This introduces us to the concept of **completeness**.  
We say a search algorithm is **complete** when it is guaranteed to find a
solution, if a solution exists.  
Unless one of the stretches of the Maze is infinite, we’ll end up, worst
case scenario, exploring the whole Maze with DFS, but we will find the exit!
(*NOTE: Some problems may contain infinite paths, beware*)

Time for a break. Return after and we’ll have a look at a different approach.

-----

Great, you’re back!

Ada is having a nightmare, remember?  
Our current solution (DFS) can get her out, but she’ll be going around,
all over the place.
Wouldn’t it be great if we could not only find the goal, but also the
shortest path to it?
Remember, each step she moves, she’ll be losing an energy point. Maybe
she doesn’t have much energy left and is bad to waste energy in general.

With DFS, we were basically committing to a path (*LEFT* first) until we
couldn’t continue anymore.

What if we kept exploring all possible paths at the same time? As we advance
one step in a path, we advance in all others too.  
Obviously we can’t advance all paths at exactly the same time in our minds,
but the idea is that we only advance in a path when we’ve done the same
to all others.

This is called Breadth First Search and it works by:

1. Starting at the **initial state**, add a mental note of all the possible
actions you can take now (all the paths you could explore).
1. For each one of those possible paths, starting from the action *LEFT*,
then *UP*, *RIGHT* and finally *DOWN*, write down where you’d be if you
moved there.
1. For each of the positions you wrote down, repeat the process.
1. If you find a dead-end, ignore that specific path and continue the process
with the others.
1. Once you find the goal, write down the sequence of actions in that
specific path.

This sounds a little bit more complicated. That’s simply because  we don’t
usually think this way. It requires us to keep too much in our minds, at
the same time.  
We use an approach that seats between BFS and DFS, but we’ll get to that later.

Now, we could jump straight to pseudo-code and Python, but let’s first think a
little bit how BFS compares with DFS.

In DFS we just kept going down one path, leaving all the other valid actions
(branches is the right term) to consider later, if necessary.
In BFS we do just the opposite, we consider all valid branches first and only
move down a path when all nodes at the same depth in the search tree were
explored.  
If you think about it, sounds like they’re the same, only the order in which
we explore the branches is different.

Remember when I said the code wasn’t perfect yet? This is why. Right now is
very hard to use the same implementation for both solutions and we want to be
able to switch between them and compare quickly.

Instead of implementing different solutions to each, we can do better! We can
think of a way to generalise these two search algorithms.  
This will avoid a lot of the code duplication and will increase the ease of
switching between different search methods.  
We can also add this generic version to our personal toolset and whenever a
problems comes by, that sounds a lot like search, we can try it quickly and
even experiment with different solutions. All in minutes!  
Whenever possible, we want to be lazy! We want to create tools that can be
reused, not always possible, but search is so widely applicable, it’ll pay off
to spend the time now.

(*NOTE: if you’re concerned with optimisations. It is true that some problems
could benefit of a more custom implementation, but doing so should be
considered only after first solving the problem with generic and tested tools*)

We want to still have one search function, but allow for a different branch
exploration order.  
In DFS we were using a *Stack*. For BFS we’re going to be using a *Queue*,
because we want to explore the nodes we’ve seen first… first.

So, apart from this data structure, the rest of the algorithm should be an
invariant. This gives us a clue as to what should be exposed in the function
arguments. Yes, the **Data Structure Type**!

Here’s the pseudo-code for BFS:  
[pseudo-code by me, now exposing the queue]

Now the interesting bit, let’s convert this into Python code!  
It still won’t be perfect, but we’ll keep iterating.  
I recommend you stop reading at this point and try to write the function
yourself.
It takes as arguments:  
**initial_state**: Ada’s initial position (x, y).  
**goal**: The position of the exit (x, y).  
**fringe**: The fringe data structure to be used (must implement an interface
  that supports *push*, *pop* and *empty* methods.

You’ll also notice I’ve defined a couple of wrapper functions for DFS and BFS
to help call the function with the right parameters.

[code editor, include some code tips like the fringe already created and the
loop? Maybe allow to go “next” and the system will fill some code until
complete. At least a dict with the action names and movement deltas]

Great! Did you see that? It considered many nodes but in the end, we got Ada
safely to the exit. She also didn’t spend much energy going around the
maze. Neat!  
Why did find a shorter path than DFS? Because we’re exploring **all** paths at
the same time, it makes sense to say that the first one to find the goal,
is the shortest.  
As for DFS, it keeps exploring the same path first. If it finds a goal there,
even if that path is very long, it doesn’t consider the others anymore,
just returns.

This introduces us to the concept of **optimality**.  
A search algorithm is **optimal** when it is guaranteed to find the optimal
solution (in this case, optimal means the shortest path).
(*NOTE: There are problems where at each step, the number of possible valid
  actions is infinite, in that case, BFS will get stuck at the same level
  forever, as it can’t progress until all sibling nodes were explored*)


OK, time for another break. Next we’re going to change the problem slightly
and introduce *different path costs*.


-----

**Walking Slow and Fast**

Hey, welcome back!

DFS and BFS only consider the branches in a fixed order. They don’t care about
the cost of each step. This is usually referred to as Uninformed Search.  
They are great for problems like the one we’ve seen so far, where each step
has exactly the same cost.

Now we’re going to consider what happens when paths can have different costs.
For this tutorial we’re only considering costs >= 0[4].

-----

**The *Slower* Maze**

You’ve saved Ada in the previous problem, well done! A day has passed since
your heroic actions took place and Ada is back in bed. You guessed right,
she’s dreaming again, another nightmare!

This time the Maze is a little more complex. In addition to the normal
positions, we have some water too. To go across positions with water it costs
Ada 2 energy points. We better avoid them if possible!

How do we go about solving it? What we learnt doesn’t consider cost,
but could we rethink it a little?  
Let’s see… DFS is stubborn and keeps going the same way until it hits a wall,
adding cost to that doesn’t sound like it could change much.  
BFS explores all paths at the same time. I told you earlier, it only continues
in a path once *all nodes at the same depth in the search tree were
explored*. What if we changed it to continue only when all nodes **of the same
cost** have been explored? Where the cost is the cost of what we’ve explored
so far (on this current path) plus the cost of this extra step.  
That means we would only explore nodes with cumulative cost of 4 after we
explored nodes with cost 3.  
By the same logic of optimality in BFS, this would guarantee that when we
find the goal, it is the cheapest path (because before we could explore a more
  expensive path, this one would have to be explored first!).

This algorithm is named *Uniform Cost Search* (UCS).  
If you think about it, if all step costs are equal to one, then the cumulative
costs are the same as the depth of the tree and results in exactly a BFS. Neat!

But wait! What data structure should we use? Priority Queues sound like a
winner. They’re based on a queue (like BFS was) but instead of ordering the
items based on when they were added to the queue, it orders them based on their
 priority (or cost in our case). So, when you pop an item next time, it’ll
 return the cheapest one first.

Sounds exactly like what we need!  
Exposing the data structure is starting to pay off.

We also need to change the representation of the maze. [continue!]

Here’s the pseudo-code for UCS:  
[psedo-code]

… and I think we’re also ready to jump straight into coding!

[coding part]

-----

A*

-----

**Closing Note:**

Search is a big field. I’ve tried to cover the very basics, but a lot was
left out.  
If you have any suggestions or further questions, I’d be happy to listen.  
It would also be great to support more languages, if you want to contribute,
contact me and we’ll figure out how to do it together.  
My address is diogo.neves@gmail.com

-----

**References:**
[0] The Matrix  
[1] AI book link  
[2] Github project  
[3] Actually, conceptually it represents all possible states of your search
progress, but in our algorithms we build the tree as we go.  
[4] If all costs are negative, you could also invert the sign and values,
but let’s not get distracted now.


—

**Notes to Self**

* Start with a simple, non-generic, get the job done function for DFS
* Then explain that making it generic lets us be lazy with better results
(good thing, more time for interesting problems). Avoids repetition, more
flexible, easier to test different approaches, proved solution (no need to
  reinvent the wheel) and unless you have a great reason, don’t optimise early,
  use existing solutions (that you understand!)

**Start writing the code there immediately but let the users play with it**

**How is the maze (walls) represented?**

find a maze that DFS goes all over

speak about just finding the exit (DFS)  
speak about optimality, we don’t want to traverse the whole thing look for the
 position next to us (BFS)


In the end, talk about memory and CPU usage.  
Say like “remember when I said it wasn’t much to keep in mind?” etc…


Have a link at the start of the page for people looking for pseudo-code and
code reference to go to the appendix with all that in the final state not the
intermediate before cleaning up.
