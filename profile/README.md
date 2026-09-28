<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/hero-dark.svg">
  <img alt="Lumanic AI. The Context Engine for the enterprise. From what was said to why it was decided." src="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/hero-light.svg" width="100%">
</picture>

<br>

Enterprise AI can tell you what was said. It cannot tell you why the organization decided what it did.

The reasons sit in the context around each sentence: what was at stake, who stood where and on what grounds, what had happened before and what people expected next. That context is spread across meetings, approvals, reports and complaints, and it is the first thing chunk-and-embed retrieval throws away.

**Lumanic builds the Context Engine for the enterprise.** At its core, the Lumanic Engine reads every communication along the three dimensions of meaning described by the sociologist Niklas Luhmann, and weaves the result into a graph that people and AI agents can question. Every answer comes back with the trail of evidence that produced it.

## Meaning has three dimensions

In Luhmann's theory of social systems, organizations are networks of decisions, and decisions are communications. Every communication carries meaning in three dimensions at once. We make each of them explicit.

| Dimension | Question | What the engine records |
|---|---|---|
| **F** Factual | What is at stake? | The issue, the function system it belongs to (economy, law, politics, education, health), and where the speaker stands on that system's code, such as payment / non-payment or legal / illegal |
| **S** Social | Who stands where, and why? | Speakers, roles and relations, stance toward others, and the grounds a judgment appeals to |
| **T** Temporal | What changes, and when? | The before/after horizon: how the past is judged, what is expected next, what remains open |

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/fst-dark.svg">
  <img alt="Illustrative example. The utterance 'Let's hold the vendor switch until Q3, Finance won't sign off without the savings case' decomposed into Factual (economy, not yet funded, deferred), Social (operations reports to Finance, conditional compliance, procedural grounds) and Temporal (planned for Q2, moved to Q3, conditional) meaning, then linked in the context graph to an earlier deferral, a Finance objection and a contract renewal date." src="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/fst-light.svg" width="100%">
</picture>

A summary would say the vendor switch was postponed. The coordinates keep what a summary drops: the stake is funding, the speaker is deferring to Finance's sign-off rather than disagreeing with it, and Q3 holds only if the savings case lands. In the graph, the sentence turns out to be the third deferral of the same issue, three months before the contract renews.

## From the Lumanic Engine to your Context Engine

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/arch-dark.svg">
  <img alt="Architecture. Meetings, reports, approvals, complaints and email flow into the Lumanic Engine (01 F·S·T Semantic Representation), then into an Enterprise Context Engine per organization (02 Context Graph Reasoning, 03 Enterprise Decision Ontology, 04 Adaptive Decision Intelligence), which serves decision-makers, AI agents and audit. Every output carries an Explain Trail; expert review feeds back as labels." src="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/arch-light.svg" width="100%">
</picture>

The Lumanic Engine is the same for every customer: it turns communication into meaning coordinates. The Context Engine built on top of it belongs to one organization. It keeps those coordinates in a graph and vector index, models the organization's units, roles, policies and rules as an ontology, and weighs issues, stakeholders, risk and priority to propose interventions. Retrieval returns evidence paths through the graph rather than loose passages, which is what lets every answer carry its trail.

## Explainable by construction

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/trail-dark.svg">
  <img alt="Illustrative Explain Trail in five steps: source utterance u-0412, its F·S·T labels with model version and confidence, the reasoning over linked utterances, a scored 'stalled decision' signal, and a recommended action pending human sign-off. Any output traces back to the exact quote, its labels, the rule and versions." src="https://raw.githubusercontent.com/lumanic-ai/.github/main/profile/assets/trail-light.svg" width="100%">
</picture>

Every signal, score and recommendation resolves to the utterances it came from, the labels they received, the rule or model that fired, and the version of each. Post-hoc attribution explains a model. An Explain Trail explains a decision.

That is becoming an obligation rather than a feature:

- Korea's AI Basic Act, in force since 22 January 2026, requires operators of high-impact AI to explain, as far as technically feasible, the results, the main criteria and principles behind them, and an overview of the training data.
- Article 86 of the EU AI Act gives people affected by decisions based on high-risk AI a right to a clear and meaningful explanation of the system's role in the decision and the main elements of the decision taken.
- ISO/IEC 42001 makes data provenance and system documentation part of an auditable AI management system.

## How we build

These rules are taken from our own labeling guide, graph schema and Explain Trail specification.

**No judgment without evidence.** Every output carries utterance IDs and quotes. A summary sentence that cannot point to its source does not ship.

**Reproducible reasoning.** Label, rule, score: each step records its reference and version, so any result can be rebuilt and audited.

**Confidence stays visible.** Human labels, inferred labels and model predictions are marked as what they are, with their confidence. Every annotator's labels are kept next to the adjudicated one, so disagreement can be measured instead of averaged away.

**Observe the form, not the belief.** Labels record what a speaker expressed, judged from an observer's position, not what an annotator believes the speaker should have meant.

**Privacy by design.** People appear as hashed IDs and roles. Raw text is kept behind access control, alongside a masked version for sharing.

## Where it applies

Anywhere decisions are made in language and have to be justified later: public administration and civil complaints, enterprise meetings, reports and approvals, manufacturing and technical documentation.

## Foundations

- Niklas Luhmann, *Social Systems* (1984; English edition Stanford University Press, 1995). Meaning and its factual, temporal and social dimensions.
- Niklas Luhmann, *Organization and Decision* (2000; English edition Cambridge University Press, 2018). Organizations as systems made of decisions.
- Niklas Luhmann, *Theory of Society* (1997; English edition Stanford University Press, 2012–2013). Function systems and their binary codes.
- George Spencer-Brown, *Laws of Form* (1969). "Draw a distinction." Our mark is his sign of distinction turned into an L, with the indicated side lit.

<details>
<summary><b>한국어 요약</b></summary>
<br>

**루마닉은 기업의 Context Engine을 만듭니다.**

기업용 AI는 무엇이 말해졌는지는 요약하지만, 조직이 왜 그렇게 결정했는지는 설명하지 못합니다. 결정의 이유는 문장을 둘러싼 맥락에 있습니다. 무엇이 걸려 있었는지, 누가 어떤 입장에서 어떤 근거로 말했는지, 이전에 무슨 일이 있었고 이후에 무엇을 기대했는지. 이 맥락은 회의·결재·보고서·민원에 흩어져 있고, 문서를 잘게 잘라 임베딩하는 검색에서 가장 먼저 사라집니다.

루마닉 엔진은 니클라스 루만의 사회체계이론이 말하는 의미의 세 차원으로 모든 소통을 읽습니다.

| 차원 | 질문 | 엔진이 기록하는 것 |
|---|---|---|
| **F** 사실 | 무엇이 걸려 있는가 | 이슈, 그 이슈가 속한 기능체계(경제·법·정치·교육·의료), 그 체계의 코드 위에서 화자의 위치 |
| **S** 사회 | 누가 어디에 서 있고, 왜 그런가 | 화자·역할·관계, 상대에 대한 입장, 판단이 기대는 근거 |
| **T** 시간 | 무엇이 언제 바뀌는가 | 이전에 대한 평가, 이후에 대한 기대, 남아 있는 불확실성 |

좌표화된 의미는 조직별 Context Graph로 엮입니다. Context Graph Reasoning이 질문 뒤의 맥락을 근거 경로와 함께 복원하고, Enterprise Decision Ontology가 조직의 의사결정 어휘를 정의하며, Adaptive Decision Intelligence가 쟁점·이해관계자·영향·리스크·우선순위를 따져 개입안을 제시합니다. 루마닉 엔진은 모든 고객에게 같고, 그 위에 세워지는 Context Engine은 한 조직의 것입니다.

모든 신호·점수·권고에는 근거 발화, 부여된 라벨, 작동한 규칙·모델, 그리고 각각의 버전까지 거슬러 올라가는 Explain Trail이 붙습니다. 2026년 1월 22일 시행된 AI 기본법은 고영향 AI 사업자에게 결과와 주요 기준·원리, 학습데이터 개요에 대한 설명을 요구하고, EU AI Act 제86조는 고위험 AI 기반 결정의 영향을 받는 사람에게 설명을 요구할 권리를 부여합니다. 루마닉은 이 요구에 사후 해석이 아니라 설계로 답합니다.

설계 원칙은 다섯 가지입니다. 근거 없는 판단은 내보내지 않는다. 모든 단계는 버전과 함께 재현된다. 신뢰도와 라벨러 간 불일치를 숨기지 않는다. 화자의 신념이 아니라 표현의 형식을 관찰한다. 개인은 해시 ID와 역할로만 다룬다.

</details>

<br>

<p align="right"><sub>Lumanic AI · South Korea</sub></p>
