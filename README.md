# 🎹 Music Interactive Theory - A Framework for Interactive Music Lessons

## 📖 Introduction

Welcome to the **Music Interactive Theory** project! This interactive learning application is designed to help users learn music theory and reinforce their understanding through engaging exercises.

This repository is part of a broader effort to make music theory **more interactive, visual, and engaging**. It is meant to be used alongside a MIDI piano and a projector, creating an **immersive learning environment**.

It is also my **end of Master project**. See more [here](https://www.google.com).

---

## 🛠️ Features

✅ **Create Custom Lessons** – A flexible framework for building step-based music learning modules.
✅ **Real-Time MIDI Interaction** – Connects to a MIDI keyboard for instant feedback.
✅ **Customizable Step System** – Developers can define their own lesson steps using reusable components.
✅ **Designed for Projection** – Optimized for projection-based learning environments with built in projection mapping .

---

## 📌 Framework Structure

The framework is designed to be modular and flexible, allowing **anyone to build their own lessons**. Here's an overview of how lessons are structured:

### **1️⃣ Defining a Lesson**

Each lesson consists of a sequence of **interactive steps**, guiding the learner through concepts such as:

- Note notation
- Sharps and flats
- Major and minor chords
- Scales

### **2️⃣ Creating Step Components**

The framework provides core step types, including:

- **SingleNoteStep** – Waits for a specific note input.
- **SequenceStep** – Requires a sequence of notes to be played in order.
- **QuizStep** – Uses keys as answer buttons for multiple-choice questions.
- **DelayStep** – Introduces timed pauses for reinforcement.

Custom steps can also be created to fit different learning needs.

### **3️⃣ Integrating Lessons**

Lessons are defined as a sequence of steps and can be easily customized by modifying the step list in a structured format.

---

## 🚀 Technologies Used

This project is built using **Next.js** and **React**, with the following key technologies:

- **WebMIDI API** – Real-time MIDI input processing
- **Tonal.js** – Music theory utilities for note manipulation
- **TailwindCSS** – UI styling for dynamic highlights

---

## 🎛️ Setup & Installation

1️⃣ Clone this repository:

```bash
  git clone https://github.com/ZilbaM/music-interactive-theory.git
  cd music-interactive-theory
```

2️⃣ Install dependencies:

```bash
  npm install
```

3️⃣ Start the development server:

```bash
  npm run dev
```

4️⃣ Open the project in your browser:

```bash
  http://localhost:3000/
```

Click on one of the lessons to start. You will go through a calibration. When you see the virtual keyboard appear, press <kbd>Shift + P</kbd> to toggle the projection mapping edit mode. Drag the 8 corners of the different elements where you need them to be. Press <kbd>Shift + P</kbd> again to turn off the edit mode.

> 🎹 **Make sure your MIDI keyboard is connected before starting!**

---

## 🎯 How to Build a Lesson

1. **Define the lesson steps** using available components.
2. **Customize step interactions** based on lesson goals.
3. **Use MIDI input** to make the lesson interactive.
4. **Test with different learners** and iterate for improvement.

---

## 🏗️ Roadmap & Future Features

🚧 **Planned Improvements:**

- Expand lesson templates for different skill levels.
- Introduce sharps and flats (black keys).
- Add visualized chord progressions.
- Implement rhythm-based exercises.
- Enable community-driven lesson contributions.

---

## 🧑‍💻 Contributing

Want to improve the framework or add new features? Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/new-step`).
3. Make your changes and commit.
4. Push your branch and submit a PR.

---

## 📜 License

This project is open-source and licensed under the **MIT License**.

---

## 📢 Contact

If you have questions or suggestions, feel free to reach out:
📧 Email: maille.basile@gmail.com
