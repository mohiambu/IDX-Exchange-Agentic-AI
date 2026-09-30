# Week 1 (OpenClaw Architecture fundamentals)


## Goal
 
The goal of week 1 is to understand how OpenClaw works and how the messages travel through the system. The main components are Channels, OpenClaw runtime, Routing, Skills, Tools, Sessions and Memory


### Channel

The Channel is how the user comminates with OpenClaw. For this project we will be using WhatsApp


### OpenClaw Runtime

The OpenClaw runtime is the main system that processes the User's requests. It connects different parts of OpenClaw and decides what should we do with the request. 

### Routing

Routing decides where the request should go, for example a property search request can be sent to a property search skill and  a market question should be sent to the Market Analysis skill 

### Skills

A skill gives OpenClaw the ability to handle a certain type of task. For this project in the upcoming weeks we could create skills like property search and market analysis.

### Tools

a tool could be used to perform a specific action. For example a database tool could be used to search the MLS database and return property information. 

### Sessions

Sessions keep track of the conversations. 
This makes OpenClaw know which message belongs to which conversation and keep the conversation context. 


### Memory

Memory helps OpenClaw keep useful information and context from a conversation.



## Architecture 

User -> WhatsApp -> OpenClaw Runtime -> Routing -> Skill -> Tool -> MLS Database -> Response -> WhatsApp -> User


## what I completed:

- Set up OpenClaw on my computer.
- Connected WhatsApp to OpenClaw.
- Tested the connection and confirmed that it is working.
- Explored the basic OpenClaw architecture.
- Looked at how channels, skills, sessions, memory, routing, and tools are organized.
- Created a simple architecture diagram showing how a user request moves through OpenClaw.
