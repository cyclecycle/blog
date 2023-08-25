---
name: landing-page-creation
date: 2023-08-25
tags: [Web Development, AI-Assisted, LLM, StudyRecon]
---

# How I created the StudyRecon landing page

At GroundedAI we just created <a href="https://studyrecon.ai" target="_blank">StudyRecon</a>, a search tool that generates reports on a given research topic.

I'm documenting the flow I used here to create the landing page for future reference.

- **Content and Messaging**
    - **Brain-dump**: Made a bunch of rough notes describing the product, features and benefits, vision, potential questions, etc.
    - **Refine notes**: Used ChatGPT to refine these notes. Prompt it to not use unnecessary adjectives/qualifiers and write in a candid, down-to-earth manner (can't stand that cheesey marketing crap).
        - This only goes so far. Edit the output to taste.
- **Web Design Iteration**
    - **Generate code** - Use ChatGPT to generate initial HTML and CSS for the landing page. Give it descriptions of different pages and structure that I have in mind. This is an iterative process as we add new pages and sections.
    - **Inspiration Sourcing**
        - Use ChatGPT to help find webpages that might provide inspiration. I wrote the feelings our brand tries to convey (supported, optimistic, energised, capable of more) and prompted it to suggest similar brands/niches that might also want to convey these feelings. This helped me search and find inspiration from other productivity software sites like evernote.com. I would note what I liked and prompt ChatGPT to produce code to achieve a similar thing.
- **Logo and Imagery Creation**
    - **Prompt examples**: Give ChatGPT some stable diffusion prompt examples such as those from [https://stablediffusion.fr/prompts](https://stablediffusion.fr/prompts) because ChatGPT doesn't currently give good stable diffusion prompts without good examples like this.
    - **Generate prompts**: Prompt ChatGPT to come up with logo and image prompts given the content and messaging output from the first step.
    - **Generate images**: Use [https://playgroundai.com/create](https://playgroundai.com/create) to generate and iterate on images.
        - Use the "remove background" or "upscale 4x" features when its time download and integrate into the site.
        - Manual doctoring of images with GIMP or Figma where necessary. E.g. to simpify the image or remove background.
- **Deploy** on gitlab pages.

<br />
This was pretty effective. The results speaks for itself 😁