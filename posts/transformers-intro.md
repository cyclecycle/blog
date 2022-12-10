---
name: transformers-intro
date: 2022-12-10
tags: [AI/ML, Transformers]
---

# A Simple Introduction to Transformers

Transformers are currently the best performing system for many tasks. My goal here is to identify just the simplest and most key ideas needed to understand them.

## What is a transformer?

A transformer is a system which learns to transform inputs (which could be lists of words, pixels, etc.) into lists of numbers. These numbers can then be fed into other parts of a system to allow the computer to perform a task.

The method for transforming the input is described by connections in a network (that is, a neural network). To learn the best method for transforming the input, the system tries to changes the connections in the network in a way that improves performance on the task.

The idea is that the lists of numbers that the transformer creates should hold the required information about the input, but in a smaller form that is easier to process. That is, the output should be more information-rich than the input itself.

## How does it work?

The meaning of an input is determined largely by how parts of the input relate to each other. For example, the meaning of a sentence is determined by the relationships between the words in the sentence. The success of the transformer may be determined largely by the way it is able to learn and represent these relationships.

The way that transformers represent relationships between parts of the input is by using _attention_. For each pair of items in the input, attention gives a weight that describes something about the relationship between them. A key idea in transformers is that you use multiple copies of this attention part (called attention _heads_), to allow the system to represent different types of relationships. For example, one attention head might focus on relationships between a word and those immediately around it, while others might learn to represent further-reaching relationships like those between a word and the main subject or action of the sentence. Together, the different relationships give a more complete representation of the input.

A major benefit of this approach is that computations for the different attention heads can all be done at the same time. This means the computations can be completed sooner. The result is transformers can run faster for the same or better performance than other systems.

## Conclusion

Transformers can be trained to create information-rich representations that allow strong performance on a variety of tasks by using attention to represent different types relationships in an way that allows for fast computation.
