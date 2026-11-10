---
name: chris-voice
description: Write or rewrite blog posts, tutorials and articles in Chris's conversational, peer-to-peer teaching voice (as in the "Learn Docker - from the beginning" series). Use when the user asks for "chris voice", to draft a post in Chris's style, or to rewrite a draft to match it.
---

# chris-voice

Write in the voice of Chris Noring's developer tutorials: warm, conversational, honest about trade-offs, and structured as "why before how". Extracted from the "Learn Docker - from the beginning, part IV" post.

## Voice and tone
- **Conversational and personal.** First person plural ("let's", "we"); occasional "I" for opinions ("In my opinion, this sounds like X would be a great fit", "I don't know about you but at this point, I'm ready to stop...").
- **Make the pain felt, with a little humour.** "It just hurts your head and your fingers." Don't define the problem abstractly; let the reader feel it.
- **Honest about trade-offs.** "As always it depends." "CAVEAT, it's not so simple." Admit when something isn't a fit.
- **Light enthusiasm, never salesy.** "Sweet :)", "really shines", "Wouldn't it be great to...". Use sparingly.
- **Peer, not lecturer.** Learn alongside the reader. Voice their likely question, then answer it: "Wait, aren't you supposed to run X first?"

## Structure
1. Short context, then a one-paragraph statement of the problem.
2. **TLDR;** line: what this post covers, and what it leaves out.
3. **"In this post we will cover:"** bullet roadmap, each bullet = **keyword, explanation**.
4. **Why before how.** Motivation first, commands/config second.
5. **Pain -> recap -> fix.** Recap what you'd do today, show it doesn't scale, then introduce the solution ("Enter X").
6. **Small steps.** One concept, one snippet, then a "Let's break it down" bullet per line.
7. **Mid-post recap** ("Let's do a small recap so far") and a **Summary** that repeats what was covered and points to the next step.

## Sentence-level habits
- Short, plain sentences. Frequent "Ok," and "Now," as transitions.
- Bullets follow **term, explanation**: "Reuse, you really want to build a capability once...".
- Rhetorical questions: "So is that the new approach everyone should use?"
- Quantify the pain with concrete counts: "three services -> six commands -> two more to tear down".
- Signposting: "Worth noting", "Let's explain in the next section", "Furthermore", "Thereby".

## Formatting
- Bullets for anything list-like. Inline code for commands and filenames; code blocks for files and trees.
- After a command or screenshot, one sentence on what the reader should see.
- Optional "Resources" block: link plus a one-line description each.

## Do NOT copy
- Typos and loose grammar from the source ("offical", "the logs is saying", inconsistent yaml/yml). Keep the voice, keep the writing clean.
- Series navigation and long preambles in single posts.
- Full tutorial depth when the piece is a problem/solution post. Keep the voice, trim the step-by-step.
- Emoji-heavy or hype language. One ":)" at most.

## Checklist before finishing
- [ ] Opens by making the reader feel the pain, with a touch of humour
- [ ] "Let's" / "we" throughout
- [ ] TLDR and "what we'll cover" list
- [ ] Why before how
- [ ] Pain counted with numbers
- [ ] One reader doubt voiced and answered
- [ ] One honest caveat
- [ ] Mid-post recap and a summary pointing to the next step
- [ ] Factual claims and doc links verified (never invent URLs or feature behaviour; flag anything unverified)

## Sample opening (n8n context)

> You know how it goes. You build a little workflow on a Sunday afternoon: a Webhook node, a couple of nodes to enrich the lead, a CRM node to hand it to the right rep. It works. Sweet. So the team starts leaning on it.
>
> Fast forward a few months. "Lead Routing" is wired into your CRM, and there are 40 people in the instance who can open it, edit it, or accidentally hit **Execute workflow** on it. That's a lot of fingers near a button that talks to your customers.
>
> **TLDR;** n8n's enterprise features let you control who can do what. In this post we'll cover:
>
> - **Projects and custom roles**, so only the right people can edit or run a workflow
> - **SSO**, so access comes from Okta or Azure AD and offboarding happens in one place
> - **2FA enforcement**, so a stolen password isn't enough
>
> Is this overkill for a weekend experiment? As always, it depends. But once an automation is something the business relies on, you want these in place.
