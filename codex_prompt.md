You are an expert software developer. Please write the code for a flashcard application aimed specifically at learning Chinese words. The application should have the following features:

### 1. Speed-Based Spaced Repetition System (SRS)
Successes must be differentiated by answering speed. The speed at which a user answers correctly affects the status of the card. If a user answers correctly within a certain number of seconds, the card's status increases to the next step. If they take too long, the status is capped or doesn't increase.

The SRS steps and time caps must be easily adjustable in the settings. Here is the default SRS scheme to implement:
- **Step 0:** 0 previous successes. Any success increases status. Repeat in 4 hours.
- **Step 1:** Success within 8 seconds increases status. Repeat in 12 hours.
- **Step 2:** Success within 3 seconds increases status. Repeat in 24 hours.
- **Step 3:** Success within 2 seconds increases status. Repeat in 2 days.
- **Step 4:** Success within 1 second increases status. Repeat in 3 days.
- **Step 5:** Success within 1 second increases status. Repeat in 5 days.
- **Step 6:** Success within 1 second increases status. Repeat in 7 days.
- **Step 7+ (Infinite Repeating Step):** For all subsequent steps, success within 1 second increases the status infinitely. The repetition interval should continue to scale up (e.g., 14 days, 30 days, 60 days, etc.) based on a simple adjustable multiplier rule.

### 2. Multi-Sided Cards
Each flashcard has three "sides":
1. Meaning (English or native language translation)
2. Pronunciation (Pinyin)
3. Characters (Hanzi)

The user must be able to configure the flashcards by choosing one or two of these sides as the "Front" of the card, and one or two as the "Back" of the card.

### 3. Import Functionality
Include a feature to import flashcards. The user should be able to bulk import data (e.g., via CSV) containing the Chinese characters and their meanings.

### 4. Audio / Pronunciation
The application must have the ability to pronounce the Chinese characters (e.g., using a Text-to-Speech / TTS API or library).

### 5. Printing Function
Add a printing functionality that allows the user to print physical copies of their flashcards. Provide options to filter which cards are printed based on their current SRS status (e.g., "Print only cards at Step 0 and 1").

### 6. Chinese-Style Theme & Layout
The UI layout, colors, and design elements should be styled with a Chinese aesthetic to fit the theme of the app (e.g., traditional patterns, appropriate color palettes like red and gold, clean but thematic design).

### 7. Variable Fonts for Character Recognition
Provide an option to change or randomize the font type of the Chinese characters displayed on the flashcards.
To help users recognize characters in the real world, the font options should include a mix of:
- Normal, standard fonts used in books and official documents (e.g., SimSun, Microsoft YaHei, KaiTi).
- "Weirder", stylized, or handwritten fonts typically used on billboards, advertisements, and store signs.

Please provide the necessary code, structure, and instructions to build and run this application.