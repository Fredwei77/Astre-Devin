# Feng Shui Alternative Solutions Prompt Optimization Complete

## Optimization Summary

### 1. Added Deep Analysis System Prompt (config.js)

Added `FOLLOWUP_SYSTEM` function in `CONFIG.PROMPTS.FENGSHUI`, supporting bilingual Chinese/English:

**Core Features**:
- Professional Feng Shui framework based on Prompts.txt document
- References classical Feng Shui texts: "Yang Zhai San Yao" (Three Essentials of Yang Dwellings), "Ba Zhai Ming Jing" (Eight Mansions Bright Mirror), "Xuan Kong Fei Xing" (Flying Stars), "Di Li Wu Jue" (Five Secrets of Geography), "Ru Di Yan Mu" (Entering Earth Eye Method)
- Integrates "Zhou Yi" (I Ching), "He Tu Luo Shu" (River Chart and Luo Writing), and modern architectural psychology
- Provides optimization guides combining traditional Feng Shui wisdom with modern living practicality

**Analysis Framework** (6 Parts):
1. **Space Energy Analysis & Bagua Layout**
   - Analyze Bagua directions (Qian, Kun, Zhen, Xun, Kan, Li, Gen, Dui)
   - Identify key positions: Wealth Position, Career Position, Health Position, Relationship Position
   - Assess energy flow quality, identify blockages or imbalances

2. **Five Elements Balance & Adjustment**
   - Analyze Five Elements (Wood, Fire, Earth, Metal, Water) distribution
   - Identify imbalances (excessive or deficient)
   - Provide specific adjustment methods (colors, materials, ornaments)

3. **Furniture Layout & Space Optimization**
   - Provide furniture placement suggestions based on "command position" principles
   - Optimize space flow lines for better energy circulation
   - Resolve sharp corners, beam pressure, door-to-door conflicts

4. **Color & Material Selection**
   - Recommend color schemes based on space orientation and occupant's favorable elements
   - Combine traditional Feng Shui with modern aesthetics
   - Provide specific material selections (flooring, walls, furniture, textiles)

5. **Feng Shui Items & Symbolic Placement**
   - Recommend specific Feng Shui items (crystals, plants, water features, mirrors, etc.)
   - Explain placement positions and functions
   - Provide budget-friendly alternatives

6. **Negative Energy Resolution & Fortune Enhancement**
   - Identify potential negative energy sources
   - Provide specific resolution methods
   - Fortune enhancement techniques (wealth, career, health, relationships)

### 2. Enhanced Follow-up Context Building (fengshui-followup.js)

**buildUserPrompt Function Enhancement**:
- Extract and pass complete Feng Shui analysis data:
  * Current direction
  * Overall energy flow score
  * Wealth corner score, health area score
  * Five Elements balance data
  * Previous analysis summary
  * Current recommendations, lucky items, taboos
- Clearly state user's follow-up question (seeking alternative solutions)
- Request detailed report following 6-part analysis framework

**English Prompt Example**:
```
Please provide alternative Feng Shui solutions based on the following space analysis results and answer the user's question.

**Task**: Based on the space information below, conduct deep Feng Shui analysis and provide practical alternative solutions.

**Input Data (Space Information)**:
- Current Direction: North (0°)
- Overall Energy Flow Score: 75%
- Wealth Corner Score: 60%
- Health Area Score: 85%

**Five Elements Balance**: Wood: 70%, Fire: 45%, Earth: 80%, Metal: 60%, Water: 35%

**Previous Analysis Summary**:
North belongs to Water element, governing career luck. Suitable for water features and blue decorations.

**Current Recommendations**: Add Water Element, Increase Fire Energy, Optimize Plant Placement

**Lucky Items**: Red Lantern, Lucky Bamboo, Dragon Statue, Crystal Sphere

**Taboos**: Avoid bed facing door, Keep wealth corner clutter-free, Avoid sharp corners pointing at people, Keep space clean and tidy

**User's Question (Seeking Alternative Solutions)**:
How can I improve my wealth corner layout?

**Analysis Framework & Output Requirements**:
[Detailed 6-part analysis requirements]
```

### 3. Upgraded System Prompt Retrieval Logic (fengshui-followup.js)

**buildSystemPrompt Function Improvements**:
- Prioritize using `CONFIG.PROMPTS.FENGSHUI.FOLLOWUP_SYSTEM(lang)` to get optimized prompt
- Fallback to simplified version if CONFIG not loaded
- Maintain multilingual support (Chinese/English)

### 4. Technical Implementation Details

**Modified Files**:

1. **config.js**
   - Added `PROMPTS.FENGSHUI.FOLLOWUP_SYSTEM(language)` function
   - Supports bilingual Chinese/English system prompts
   - Based on traditional Feng Shui classics and modern architectural psychology

2. **fengshui-followup.js**
   - Optimized `buildSystemPrompt()` function to use CONFIG's optimized prompt
   - Optimized `buildUserPrompt()` function to provide complete space analysis data
   - Kept existing `handleFollowupQuestion()` function unchanged (already using `aiService.sendRequest`)

## Usage Effects

### Before Optimization
- Simple Feng Shui advice
- Lack of deep space analysis
- No classical citations or professional framework
- Generic recommendations

### After Optimization
- Deep analysis based on traditional Feng Shui classics
- Citations from "Yang Zhai San Yao", "Ba Zhai Ming Jing", etc.
- Comprehensive analysis across 6 dimensions:
  1. Space Energy Analysis & Bagua Layout
  2. Five Elements Balance & Adjustment
  3. Furniture Layout & Space Optimization
  4. Color & Material Selection
  5. Feng Shui Items & Symbolic Placement
  6. Negative Energy Resolution & Fortune Enhancement
- Integrates modern architectural psychology and aesthetics
- Provides specific actionable alternative solutions (exact positions, sizes, colors, materials)
- Considers budget and feasibility, provides multiple alternatives

## Example Dialogue

**User Follow-up**: How can I improve my wealth corner layout?

**AI Response** (After Optimization):
```markdown
## Part 1: Space Energy Analysis & Bagua Layout

### Wealth Position Identification & Analysis
Based on your space orientation (North 0°), combined with Eight Mansions Feng Shui theory, your **Wealth Position** is located at:
- **Bright Wealth Position**: 45-degree diagonal from entrance door (usually in living room)
- **Hidden Wealth Position**: According to Eight Mansions Flying Stars, your house sits North facing South (**Kan House**), wealth positions are at **Southwest (Kun Position)** and **True North (Kan Position)**

**Classical Citation**: "Yang Zhai San Yao" states: "Door, Master, Stove - when these three harmonize, wealth flows abundantly."
Your wealth position's current energy flow score is 60%, medium level with significant room for improvement.

### Energy Flow Assessment
- **Blockage Points**: Wealth area may have clutter accumulation or improper furniture placement
- **Imbalance Points**: Water element only 35%, unfavorable for wealth circulation (Water governs wealth)
- **Advantage Points**: Earth element 80%, favorable for wealth accumulation and stability

---

## Part 2: Five Elements Balance & Adjustment

### Current Five Elements Analysis
Your space Five Elements distribution:
- **Wood**: 70% (slightly excessive)
- **Fire**: 45% (insufficient)
- **Earth**: 80% (prosperous) ✓
- **Metal**: 60% (balanced)
- **Water**: 35% (severely insufficient) ⚠️

### Wealth Position Five Elements Adjustment Plan

**Solution 1: Enhance Water Element (Primary)**
1. **Color Adjustment**
   - Use **deep blue** (#003366) or **black** (#1a1a1a) as main colors in wealth area
   - Can be implemented through rugs, cushions, decorative paintings
   - Avoid red, orange (Fire restrains Metal, Metal generates Water is blocked)

2. **Material Selection**
   - Add **glass material** furniture (glass coffee table, glass display cabinet)
   - Use **metal material** ornaments (copper, stainless steel) - Metal generates Water
   - Avoid excessive wooden furniture (Wood restrains Earth, Earth restrains Water)

3. **Ornament Recommendations**
   - **Crystal Sphere**: Diameter 8-12cm, place at wealth position center
     * Recommended: Black obsidian crystal sphere (absorbs negative energy, enhances Water element)
     * Position: Southwest wealth position, 80-100cm above ground
     * Budget: $30-75
   
   - **Aquarium/Water Feature**:
     * Size: 60cm x 40cm x 50cm (L x W x H)
     * Position: True North wealth position, against wall
     * Fish quantity: 6 or 8 (six is Water number, eight is prosperity number)
     * Fish species: Goldfish or Koi (gold, red colors preferred)
     * Budget: $75-300
   
   - **Flowing Water Ornament** (Budget-friendly alternative):
     * Small desktop water fountain
     * Position: Wealth position desk or cabinet
     * Budget: $15-45

**Solution 2: Balance Fire Element (Supplementary)**
Insufficient Fire element affects wealth's "vitality" and "fluidity".

1. **Lighting Optimization**
   - Install **warm-toned lighting** in wealth area (color temperature 2700K-3000K)
   - Use **floor lamps** or **table lamps** for local lighting
   - Avoid cool white light (above 5000K)

2. **Decorations**
   - Add **red or orange decorative paintings** (abstract art or landscape)
   - Size: 60cm x 80cm
   - Position: Wealth position background wall

---

## Part 3: Furniture Layout & Space Optimization

### Wealth Position Furniture Placement Principles

**"Command Position" Principle Application**:
Wealth position should be the most stable, most "backed" position in the space.

**Specific Layout Recommendations**:

1. **Sofa/Seating Placement**
   - Place main sofa with back against wealth position wall (Southwest or True North)
   - Sofa should not have window or door behind (avoid "no backing")
   - If window exists, use heavy curtains to block

2. **Cabinet/Bookshelf Placement**
   - Place **solid wood cabinet** or **bookshelf** at wealth position
   - Height: 180-200cm (symbolizes stable "backing mountain")
   - Cabinet contents:
     * Financial documents, bankbooks, valuables
     * Wealth-attracting ornaments (Pixiu, Money Toad, Treasure Bowl)
     * Avoid clutter or damaged items

3. **Resolve Sharp Corner Negative Energy**
   - If wealth position has sharp corners pointing at it, use **round plants** (like Money Tree) to resolve
   - Or use **fabric screen** to block sharp corners

### Space Flow Line Optimization

**Floor Plan Suggestion**:
```
[Entrance Door]
    ↓
[Foyer] → [Living Room] → [Wealth Area (Southwest Corner)]
                           ├─ Sofa (back against wall)
                           ├─ Coffee Table (glass material)
                           └─ Aquarium/Water Feature (True North)
```

**Flow Line Key Points**:
- Wealth area should remain **open**, don't pile clutter
- Path from entrance to wealth position should be **unobstructed**
- Avoid wealth position directly facing bathroom or kitchen door

---

## Part 4: Color & Material Selection

### Wealth Position Color Scheme

**Main Colors**: Deep Blue + Gold + Black
- **Deep Blue** (#003366): Walls, rugs, curtains
- **Gold** (#FFD700): Decorations, frames, lighting
- **Black** (#1a1a1a): Furniture, ornaments

**Auxiliary Colors**: White, Gray
- Used to balance space, avoid excessive heaviness

**Taboo Colors**: Red, Orange (large areas)
- Fire restrains Metal, Metal generates Water is blocked, unfavorable for wealth

### Material Selection List

| Area | Recommended Material | Feng Shui Principle | Budget |
|------|---------------------|---------------------|--------|
| Flooring | Dark wood or marble | Earth generates Metal, Metal generates Water | $10-20/sqft |
| Walls | Deep blue latex paint or wallpaper | Enhance Water element | $2-5/sqft |
| Furniture | Solid wood + glass combination | Wood generates Fire, Fire generates Earth, Earth generates Metal, Metal generates Water | $750-2250 |
| Curtains | Heavy silk or velvet | Block negative energy, gather wealth | $30-75/panel |
| Rug | Wool or synthetic deep blue | Enhance Water element, soften space | $75-300 |

---

## Part 5: Feng Shui Items & Symbolic Placement

### Wealth-Attracting Feng Shui Items Recommendations

**1. Pixiu (Primary)**
- **Type**: Copper or jade Pixiu
- **Size**: Height 10-15cm
- **Placement Position**: On wealth position cabinet, head facing door or window (absorbing wealth)
- **Placement Taboos**:
  * Don't face mirror (wealth reflects away)
  * Don't face bathroom (filthy energy)
  * Head shouldn't directly face main door (conflicts with door god)
- **Consecration**: Recommend temple consecration or self-purification (soak in salt water 24 hours)
- **Budget**: $45-225

**2. Money Toad (Three-Legged Toad)**
- **Type**: Copper or resin Money Toad
- **Size**: Height 8-12cm
- **Placement Position**:
  * Toad with coin in mouth: Head facing indoors (spitting wealth)
  * Toad without coin: Head facing outdoors (absorbing wealth)
- **Placement Time**: Morning 7-9am (Chen hour) is optimal
- **Budget**: $30-120

**3. Treasure Bowl**
- **Type**: Ceramic or crystal Treasure Bowl
- **Size**: Diameter 20-30cm
- **Placement Position**: Inside wealth position cabinet or on desktop
- **Contents**:
  * Place coins (168 or 888 pieces)
  * Place five-color crystals (white, yellow, green, red, black)
  * Place Five Emperor Coins (Shunzhi, Kangxi, Yongzheng, Qianlong, Jiaqing)
- **Budget**: $22-90

**4. Money Tree/ZZ Plant**
- **Species**: Money Tree (Pachira aquatica) or ZZ Plant (Zamioculcas zamiifolia)
- **Size**: Height 120-150cm
- **Placement Position**: Wealth position corner, don't block main flow lines
- **Care Tips**:
  * Keep soil moist but not waterlogged
  * Rotate pot weekly for even light exposure
  * Regularly trim dead leaves
- **Budget**: $30-120

**5. Crystal Array (Advanced Solution)**
- **Types**: Citrine + Green Phantom + Black Obsidian combination
- **Layout**:
  * Center: Citrine sphere (diameter 8cm) - main wealth
  * Surrounding: Green Phantom columns (4 pieces, height 10cm) - career wealth
  * Outer: Black Obsidian (8 pieces, diameter 3cm) - protect wealth from negative energy
- **Placement Position**: Wealth position desktop or cabinet
- **Budget**: $120-450

### Budget-Friendly Alternatives

**Limited Budget (under $75)**:
1. Small water fountain ($15-45)
2. Copper coin pendant ($7-22)
3. Blue rug ($30-75)
4. Gold decorative painting ($15-45)

**Ample Budget (over $750)**:
1. Large aquarium + Koi ($300-750)
2. Jade Pixiu ($150-450)
3. Crystal array ($120-450)
4. Solid wood wealth cabinet ($450-1200)

---

## Part 6: Negative Energy Resolution & Fortune Enhancement

### Common Wealth Position Negative Energy Identification & Resolution

**1. Wealth Position Pressure Negative Energy**
- **Identification**: Beam, air conditioner, chandelier pressing down above wealth position
- **Resolution Methods**:
  * Place **gourd** (copper or wood) under beam
  * Use **false ceiling** to cover beam
  * Move furniture to avoid directly under beam
- **Budget**: $15-75

**2. Wealth Position Empty Negative Energy**
- **Identification**: Window or open area behind wealth position
- **Resolution Methods**:
  * Install **heavy curtains**, keep closed
  * Place **tall plants** or **screen** in front of window
  * Place **Five Emperor Coins** or **Mountain Sea Town** on windowsill
- **Budget**: $30-120

**3. Wealth Position Pollution Negative Energy**
- **Identification**: Wealth position facing bathroom door, kitchen door, or trash can
- **Resolution Methods**:
  * Keep bathroom door closed, hang **door curtain**
  * Place **screen** or **tall plants** between wealth position and bathroom
  * Paste **Five Elements Bagua Blessing** on bathroom door
- **Budget**: $7-45

**4. Wealth Position Sharp Corner Negative Energy**
- **Identification**: Wealth position shot by wall corner, cabinet corner, table corner
- **Resolution Methods**:
  * Use **round plants** (like Money Tree) to block sharp corner
  * Place **crystal column** or **gourd** at sharp corner
  * Wrap sharp corner with **fabric**
- **Budget**: $15-75

### Wealth Enhancement Techniques

**Daily Operations**:
1. **Keep Wealth Position Clean**
   - Clean wealth area daily, don't pile clutter
   - Wipe wealth ornaments weekly, keep shiny

2. **Regularly Change Water Feature Water Quality**
   - Change 1/3 aquarium water weekly
   - Clean water fountain monthly

3. **Plant Care**
   - Trim dead leaves promptly
   - Keep plants healthy and lush

**Special Timing Enhancement**:
1. **Lunar 1st and 15th**
   - Light **sandalwood** or **agarwood** at wealth position
   - Time: Morning 7-9am (Chen hour)
   - Duration: 15-30 minutes

2. **Annual Spring Beginning** (Feb 3-5)
   - Place **red envelope** at wealth position (containing $168 or $888)
   - Press under Treasure Bowl
   - Take out after one year to use, place new red envelope

3. **Monthly 1st Day**
   - Place **fresh fruits** at wealth position (apples, oranges, grapes)
   - Quantity: 8 or 9 pieces
   - Eat or share after three days

### Implementation Timeline & Priority

**Week 1 (High Priority)**:
1. Clear wealth area clutter
2. Adjust furniture positions (sofa, cabinet)
3. Add basic lighting

**Week 2 (Medium Priority)**:
1. Purchase and place water feature/aquarium
2. Add wealth-attracting ornaments (Pixiu or Money Toad)
3. Replace wealth area colors (rug, curtains)

**Week 3 (Low Priority)**:
1. Optimize plant placement
2. Add decorative paintings
3. Perfect details (crystals, coins, etc.)

**Long-term Maintenance**:
- Daily: Keep clean
- Weekly: Clean ornaments, change water
- Monthly: Check plants, adjust layout
- Yearly: Update ornaments, re-consecrate

---

## Summary & Action Recommendations

**Core Points**:
1. **Enhancing Water Element** is key to improving wealth position (currently only 35%)
2. **Keeping wealth position clean** and **energy flowing** is fundamental
3. **Combining multiple methods** (colors, materials, ornaments) yields best results

**Immediate Action Checklist**:
✅ Clear wealth position clutter
✅ Place water feature or aquarium at wealth position
✅ Add deep blue rug or curtains
✅ Place wealth-attracting ornaments (Pixiu/Money Toad)
✅ Adjust furniture positions, optimize flow lines

**Budget Allocation Suggestions**:
- **Basic** (under $150): Water fountain + Copper Pixiu + Blue rug
- **Standard** ($450-750): Aquarium+Koi + Jade Pixiu + Money Tree + Color adjustments
- **Premium** (over $1500): Large aquarium + Crystal array + Solid wood wealth cabinet + Comprehensive renovation

**Feng Shui Principle Summary**:
"Yang Zhai San Yao" states: "Wealth position should be bright not dark, still not moving, seated not empty."
Your wealth position optimization plan fully follows this principle. Through enhancing Water element, optimizing layout, and adding wealth-attracting items,
your wealth fortune will surely improve, bringing abundant prosperity! 💰

---

**Disclaimer**: Feng Shui is part of traditional Chinese culture. Above suggestions are for reference only.
True wealth comes from personal effort and wisdom. Feng Shui is merely an auxiliary tool.
Wishing you prosperous wealth and successful career! 🏠✨
```

## Technical Advantages

1. **Professionalism**: Based on traditional Feng Shui classics with original text citations
2. **Systematic**: 6-part analysis framework covering space energy, Five Elements, layout, colors, items, negative energy resolution
3. **Practicality**: Provides specific actionable advice (exact positions, sizes, colors, materials, budgets)
4. **Modernity**: Integrates modern architectural psychology and aesthetics
5. **Diversity**: Provides multiple alternative solutions considering different budgets
6. **Multilingual**: Full support for Chinese/English bilingual
7. **Extensibility**: System prompts independently configured, easy to optimize later

## Deployment Instructions

All code modifications complete, no additional configuration needed.
Users will automatically use optimized prompts when performing "Alternative Solutions Consultation" follow-ups on the Feng Shui page.

---

**Optimization Completed**: 2024-12-08
**Based On**: Prompts.txt document (combined with Feng Shui professional knowledge)
**Files Modified**: config.js, fengshui-followup.js
