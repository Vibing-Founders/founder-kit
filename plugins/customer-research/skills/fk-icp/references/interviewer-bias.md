# Interviewer bias

An interview is only useful where the customer is talking about their own life. When the
interviewer leads, the customer often agrees to be polite, and the founder hears what
they hoped to hear. Check for bias before extracting anything.

## What to flag

| Pattern | What it looks like | Example |
|---|---|---|
| Leading question | The question carries the answer | "Isn't it a pain keeping receipts for every shoot?" |
| Suggested answer | Interviewer offers options or finishes the sentence | "So you'd want it automatic, right? Like, it just sorts itself?" |
| Pitching | Interviewer describes the product, then asks for a reaction | "We're building an app that plans your meals around your rota. Would that help?" |
| Interviewer opinion | Interviewer states their own view | "I always found spreadsheets awful for this." |
| Hypothetical | Asks what the customer would do, not what they did | "Would you pay £10 a month for that?" |
| Stacked question | Several questions at once, so it is unclear which was answered | "How do you plan meals, and is it stressful, and do you use an app?" |

## Spontaneous or prompted

Label every pain point and signal:

- **Spontaneous**: the customer raised it unprompted, or in answer to an open question
  ("Tell me about the last time you…", "Walk me through…", "What happened next?").
- **Prompted**: it only appeared after a leading question, suggestion or pitch.

A prompted finding is not thrown away. It is recorded as prompted, given less weight in
prioritisation, and listed as something to test with an open question next time.

Signs that a prompted answer is weak: short agreement ("yeah, totally", "I guess so"),
repeating the interviewer's words back, or no story or example attached.

Signs that it may still be real: the customer adds detail the interviewer did not
supply, tells a specific story, or describes money or time they already spent on it.

## Ignore the interviewer's knowledge

Facts, opinions or product details the interviewer supplied are not customer evidence,
even if the customer agreed with them.

## How to report it

At the top of the analysis, before pain points:

```markdown
## Interviewer bias

- **Leading question** (12:40): "Isn't it a pain keeping receipts for every shoot?"
  Customer: "Yeah, I suppose." → the receipts pain is **prompted** and weakly supported.
- **Pitch** (18:05): interviewer described auto-categorising. Everything the customer
  said about categories after this point is treated as prompted.

**Overall:** 3 of 9 pain signals were prompted. Next time, try: "Tell me about the last
time you did your accounts. What happened?"
```

Always give the founder a better open question to use next time for each flagged
pattern. The aim is to help them interview better, not to tell them off.
