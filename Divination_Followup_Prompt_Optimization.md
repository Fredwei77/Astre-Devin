# Divination Follow-up Prompt Optimization Complete

## Optimization Summary

### 1. Added Deep Analysis System Prompt (config.js)

Added `FOLLOWUP_SYSTEM` function in `CONFIG.PROMPTS.DIVINATION`, supporting bilingual Chinese/English:

**Core Features**:
- Professional numerology framework based on Prompts.txt document
- References classical numerology texts: "Di Tian Sui", "Qian Li Ming Gao", "Zi Ping Zhen Quan", "San Ming Tong Hui", etc.
- Integrates modern psychology (Jungian archetypes, MBTI) and physiognomy
- Provides professional analysis combining classical Chinese and vernacular

**Analysis Framework** (5 Parts):
1. **Destiny Overview & Original Chart Analysis**
   - BaZi Chart (Year/Month/Day/Hour pillars, Fetal Element, Life Palace, Body Palace)
   - Strength & Favorable/Unfavorable Elements (Day Master timing/positioning/momentum, pattern determination, favorable/unfavorable elements)
   - Four Palaces & Six Relatives Analysis (Parents/Career/Marriage/Children Palaces)
   - Auspicious/Inauspicious Stars Analysis (Tian Yi Noble, Peach Blossom, Yang Blade, Void, etc.)

2. **Annual Fortune (2026 Bing Wu Year)**
   - Annual Overview (Great Luck and Annual clash/harm/combination/punishment relationships)
   - Twelve Monthly Details (Career/Wealth/Health/Relationships for lunar months 1-12)
   - Classical Citations for fortune judgments

3. **Survival Guide & Fortune Enhancement**
   - Feng Shui Adjustments (colors, directions, ornaments)
   - Daily Life Details (diet, clothing, accessory materials)
   - Psychological & Behavioral Advice (MBTI personality blind spots analysis)

4. **Social & Marriage Portrait**
   - Benefactors & Adversaries (specific BaZi characteristics, e.g., "favorable to those with Bing Fire in Heavenly Stems")
   - Marriage Compatibility Portrait (appearance, age difference, occupation, personality, interaction patterns)

5. **Constraints**
   - Simplify complex terminology
   - Markdown formatting with bold key points
   - Objective and neutral, provide solutions even for inauspicious signs

### 2. Enhanced Follow-up Context Building (divination-followup.js)

**buildFollowupContext Function Enhancement**:
- Extract and pass Five Elements distribution data
- Include complete birth information (date, time, place, gender, Four Pillars)
- Pass previous divination summary as context
- Clearly state user's follow-up question
- Request detailed report following 5-part analysis framework

**English Prompt Example**:
```
Please answer the user's follow-up question based on the following birth information and perform in-depth BaZi analysis.

**Task**: Based on the birth information below, conduct deep BaZi chart analysis and fortune deduction...

**Input Data (User Information)**:
- Gender: Male/Female
- Birth Place: Beijing (for True Solar Time correction)
- Birth Date: 1990-01-01
- Birth Time: 08:30
- Four Pillars: Year [Geng Wu] Month [Wu Zi] Day [Jia Yin] Hour [Wu Chen]

**Analysis Category**: Career

**Previous Divination Summary**: ...

**Five Elements Distribution**: Wood: 70, Fire: 45, Earth: 80, Metal: 60, Water: 35

**User's Follow-up Question**: How can I improve my career fortune?

**Analysis Framework & Output Requirements**:
[Detailed 5-part analysis requirements]
```

### 3. Upgraded Follow-up Processing Logic (divination-followup.js)

**handleFollowupQuestion Function Improvements**:
- Retrieve optimized system prompt `CONFIG.PROMPTS.DIVINATION.FOLLOWUP_SYSTEM(lang)`
- Use new `AIService.chatWithSystem()` method
- Separate system prompt and user prompt for more precise AI instructions
- Maintain multilingual support (Chinese/English)

### 4. Added AI Service Methods (ai-service.js)

**Two New Methods**:

1. **chatWithSystem(systemPrompt, userPrompt, options)**
   - Generic chat interface supporting custom system prompts
   - For scenarios requiring professional system prompts like deep truth exploration
   - Returns AI response text

2. **chat(message, options)**
   - Simplified chat interface
   - Uses default system prompt
   - Suitable for simple follow-up scenarios

## Technical Implementation

### Modified Files

1. **config.js**
   - Added `PROMPTS.DIVINATION.FOLLOWUP_SYSTEM(language)` function
   - Supports bilingual Chinese/English system prompts

2. **divination-followup.js**
   - Optimized `buildFollowupContext()` function
   - Upgraded `handleFollowupQuestion()` function
   - Uses new system prompt and AI service methods

3. **ai-service.js**
   - Added `chatWithSystem()` method
   - Added `chat()` method
   - Supports AI dialogue with custom system prompts

## Usage Effects

### Before Optimization
- Simple follow-up answers
- Lack of deep numerology analysis
- No classical citations or professional framework

### After Optimization
- Deep analysis based on traditional numerology classics
- Citations from "Di Tian Sui", "Zi Ping Zhen Quan", etc.
- Comprehensive analysis across 5 dimensions:
  1. Destiny Overview (BaZi chart, strength analysis, Four Palaces)
  2. Annual Fortune (2026 monthly details)
  3. Survival Guide (Feng Shui, daily tips, psychological advice)
  4. Social Portrait (benefactor/adversary characteristics)
  5. Marriage Portrait (appearance, occupation, personality, interaction patterns)
- Integrates modern psychology (MBTI) and physiognomy
- Provides specific actionable fortune enhancement advice

## Example Dialogue

**User Follow-up**: How can I improve my career fortune?

**AI Response** (After Optimization):
```markdown
## Part 1: Destiny Overview & Original Chart Analysis

### BaZi Chart
- Year Pillar: Geng Wu (Heavenly Stem Geng Metal, Earthly Branch Wu Fire)
- Month Pillar: Wu Zi (Heavenly Stem Wu Earth, Earthly Branch Zi Water)
- Day Pillar: Jia Yin (Day Master Jia Wood, Earthly Branch Yin Wood)
- Hour Pillar: Wu Chen (Heavenly Stem Wu Earth, Earthly Branch Chen Earth)
- Fetal Element: Ji Mao
- Life Palace: Bing Yin
- Body Palace: Xin Si

### Strength & Favorable/Unfavorable Elements Analysis
**Day Master Jia Wood** born in Zi month (winter), Water prosperous Wood flourishing, favorable timing.
Earthly Branch Yin Wood as root, favorable positioning.
Comprehensive judgment: **Strong Day Master Pattern**

**Favorable Elements**: Fire, Earth (drain Wood to generate Wealth, adjust warmth)
**Unfavorable Elements**: Water, Wood (increase strength, restrain Wealth Star)

**Classical Citation**: "Di Tian Sui" states: "How to know one's nobility? Official Star has proper arrangement."
Your chart's Official Star (Metal) is weak, but Wealth Star (Earth) is strong, suitable for business or management.

### Career Palace Analysis (Month Pillar Wu Zi)
Month Pillar as Career Palace, Wu Earth Wealth Star transparent, indicates **business talent** and **wealth accumulation ability**.
Zi Water as unfavorable element, beware of **workplace adversaries** and **hidden competition**.

**Auspicious Stars**: Month Pillar carries **Wen Chang Noble**, favorable for clerical, planning, creative work.

---

## Part 2: Annual Fortune (2026 Bing Wu Year)

### Annual Overview
2026 Bing Wu year, Heavenly Stem Bing Fire is favorable element, Earthly Branch Wu Fire also favorable.
**Very auspicious year**, career and wealth both flourish!

**Clash/Harm/Combination/Punishment**:
- Wu Fire and Day Branch Yin Wood **half-combine Fire Bureau**, strengthen favorable element
- Wu Fire and Month Branch Zi Water **clash**, resolve unfavorable Water influence

### Twelve Monthly Details

**Lunar Month 1 (Geng Yin)**:
- Career: New year beginning, benefactor assistance, suitable for launching new projects
- Wealth: Regular income good, investment requires caution
- Health: Pay attention to liver and gallbladder
- Relationships: Peach blossom luck strong, singles have opportunities

**Lunar Month 2 (Xin Mao)**:
- Career: Wood prosperous restrains Earth, Wealth Star restricted, need low-profile approach
- Wealth: Expenses increase, avoid impulsive spending
- Health: Pay attention to spleen and stomach
- Relationships: Prone to arguments, need more communication

[... Continue monthly analysis through Month 12]

**Classical Citation**: "San Ming Tong Hui" states: "Wu Fire in power, Wood Fire illuminating, literary brilliance revealed."

---

## Part 3: Survival Guide & Fortune Enhancement

### Feng Shui Adjustments
**Favorable elements are Fire and Earth**, recommendations:
- **Colors**: Wear more red, orange, yellow, brown clothing
- **Directions**: Office desk facing South (Fire position) or Southwest (Earth position)
- **Ornaments**: Place **red crystal sphere** or **ceramic horse** (Wu Fire) in office

### Daily Life Details
- **Diet**: Eat more warm foods (lamb, chili, ginger) to supplement Fire
- **Accessories**: Wear **red agate**, **garnet** bracelets
- **Numbers**: Phone number ending in 2, 7 (Fire) or 5, 0 (Earth)

### Psychological & Behavioral Advice
**MBTI Analysis**: Your chart shows **ENTJ traits** (Extroverted, Intuitive, Thinking, Judging)
- **Strengths**: Decisive, goal-oriented, strong leadership
- **Blind Spots**: Too assertive, neglect others' feelings
- **Advice**: Listen more to team opinions, cultivate empathy

---

## Part 4: Social & Marriage Portrait

### Benefactor Characteristics
**Favorable BaZi Characteristics**:
1. Heavenly Stem transparent **Bing Fire, Ding Fire** people (e.g., born 1986 Bing Yin, 1987 Ding Mao)
2. Earthly Branch with **Wu Fire, Si Fire, Wei Earth, Xu Earth** people
3. Zodiac **Horse, Snake, Sheep, Dog** collaboration partners

**Complementarity Reason**: Fire and Earth are your favorable elements, can boost career and wealth.

### Adversary Characteristics
**Avoid BaZi Characteristics**:
1. Heavenly Stem transparent **Ren Water, Gui Water** people (e.g., born 1992 Ren Shen, 1993 Gui You)
2. Earthly Branch with **Zi Water, Hai Water** people
3. Zodiac **Rat, Pig** collaborations require caution

**Reason**: Water is unfavorable element, will restrain your Fire favorable element, bring obstacles.

### Marriage Compatibility Portrait
**Destined Partner Characteristics** (Physiognomy combined):
- **Appearance**: Round or square face, reddish complexion, gentle bright eyes
- **Height**: Medium to tall (165-175cm)
- **Age Difference**: 2-4 years younger or 1-3 years older
- **Features**: Straight nose bridge (good wealth), full lips (good communication)

**Occupation & Personality**:
- **Industry**: Education, culture, design, food service, beauty (Fire/Earth industries)
- **Personality**: Enthusiastic, down-to-earth, responsible, good at financial management
- **MBTI**: ESFJ or ISFJ (Extroverted Sensing Feeling Judging)

**Interaction Pattern**:
- You focus on career (external), partner manages home (internal)
- Complementary marriage, you provide direction, partner provides support
- Smooth communication, few major conflicts

---

## Summary & Action Recommendations

**Specific Steps to Improve Career Fortune**:
1. **Immediate Action**: 2026 is your **Great Fortune Year**, seize opportunities to launch important projects
2. **Direction Selection**: Choose South or Southwest facing office, same for home study
3. **Color Application**: Work attire primarily red, orange, yellow
4. **Benefactor Collaboration**: Proactively connect with Horse, Snake, Sheep zodiac partners
5. **Timing**: Lunar months 1, 5, 9 are career peak periods
6. **Mindset Adjustment**: Stay proactive but avoid being too assertive

**Resolve Unfavorable Factors**:
- Avoid major decisions in Lunar Month 11 (Zi month)
- Stay away from Rat, Pig zodiac adversaries
- Regularly perform Fire element Feng Shui adjustments

**Gentleman asks about disasters, not blessings** - destiny is in your own hands.
Above analysis for your reference, wishing your career prosperity! 🔥
```

## Technical Advantages

1. **Professionalism**: Based on traditional numerology classics with original text citations
2. **Systematic**: 5-part analysis framework covering destiny, annual fortune, enhancement, social, marriage
3. **Practicality**: Provides specific actionable advice (colors, directions, accessories, timing)
4. **Modernity**: Integrates MBTI psychology and physiognomy
5. **Multilingual**: Full support for Chinese/English bilingual
6. **Extensibility**: System prompts independently configured, easy to optimize later

## Deployment Instructions

All code modifications complete, no additional configuration needed.
Users will automatically use optimized prompts when performing "Deep Truth Exploration" follow-ups on the divination page.

---

**Optimization Completed**: 2024-12-08
**Based On**: Prompts.txt document
**Files Modified**: config.js, divination-followup.js, ai-service.js
