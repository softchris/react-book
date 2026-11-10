---
name: n8n-blog-voice
description: Write or rewrite posts for the n8n blog (blog.n8n.io) in the house style: plain, confident, problem-led explainers and announcements. Use when drafting or editing anything meant for the n8n blog, or when the user asks for "n8n blog voice".
---

# n8n-blog-voice

House style inferred from two n8n blog posts: the "Nod" research-preview announcement and the "API throttling vs. rate limiting" explainer. Two samples only; treat as a starting point and ask the user to confirm against a style guide if one exists. For Chris's personal Dev.to tutorial voice use `chris-voice` instead.

## Tone
- Plain, confident, technical-but-friendly. No hype, no exclamation marks, no emoji in prose (the single 💡 callout is the exception).
- Little or no humour. Warmth comes from clarity, not jokes.
- "We" = n8n; "you" = the reader or their workflow. Avoid "Let's", "Ok,", chatty fillers.
- Speak about *the reader's workflow*: "You can't control the limits an API sets, but you can control how your workflow responds."

## Opening
- First one or two sentences state the problem (explainer) or the news (announcement). No scene-setting or anecdote before the point.
- Anecdotes/scenarios are fine later, kept short and labelled as hypothetical when invented.

## Structure
1. Problem or news in the opening paragraph; one sentence on what the post helps with.
2. Concept first: define the terms and the "why", with a comparison table where two things are contrasted.
3. Descriptive headings that read like search phrases ("Rate limiting vs. throttling: The practical difference"). Sentence case. No cute narrative headings.
4. Product section late: "<Pattern> in n8n", naming nodes and settings exactly (e.g. Retry On Fail, Error Trigger node), with a template link ("Use this workflow") and a sign-up/CTA block.
5. An honest-limits section or aside: "What it doesn't do, yet" / "Make sure the request is safe to repeat."
6. Short closing paragraph restating the takeaway, then practical CTA (try one thing) and a list of links (docs, templates, community forum).

## Sentence-level habits
- Short declarative sentences, concrete numbers and examples ("100 requests per minute... request 101").
- Bulleted example lists as plain phrases; headed one-liners for principles ("It's yours", "Only you give it permission").
- Cross-link related posts in 💡 callouts.
- Practical ordering advice ("Pace requests first, then use retries as safeguards").

## Formatting
- Comparison tables, captioned diagrams/screenshots, inline code for node and setting names, a 💡 callout for side tips.
- Roughly 800-1,200 words unless told otherwise.

## Facts and links
- Name product features exactly as in the UI/docs. Never invent URLs, settings or behaviour; mark anything unverified with `[VERIFY: ...]` for the author.
- Hypothetical scenarios are labelled as such. Never present them as customer stories.
- Boilerplate used in n8n explainers: "n8n is a source-available, AI-native automation platform".

## Checklist
- [ ] Problem or news stated in the first two sentences
- [ ] Concept explained before product
- [ ] Comparison table or clear before/after
- [ ] Headings read as search phrases
- [ ] Features named exactly, with docs/template links
- [ ] An honest-limits note
- [ ] Practical CTA and link list
- [ ] No jokes, hype or chatty fillers
- [ ] All `[VERIFY]` items resolved before publishing
