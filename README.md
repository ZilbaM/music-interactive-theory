# Interactive Music Theory Learning System

# WORK IN PROGRESS - SEE ROADMAP

An innovative project aimed at enhancing music theory education through an interactive setup using a connected piano and a video projector. This system leverages technology to create an immersive, hands-on learning experience that blends intuitive exploration with theoretical understanding.

---

## Project Overview

This project aims to develop an interactive music theory learning system that utilizes a connected piano and a video projector to create an engaging educational environment. The system is designed to:

- Provide real-time visual feedback by projecting information directly onto piano keys and a dedicated display surface.
- Offer a flexible learning framework that caters to different learning styles through intuitive and comprehension-based paths.
- Enhance the retention and application of music theory concepts by integrating hands-on interaction with theoretical knowledge.

---

## Features

- **Interactive Piano Integration**: Real-time MIDI input/output handling to interact seamlessly with a physical piano.
- **Projection Mapping**: Visual projections onto piano keys and a display surface for immersive learning.
- **Flexible Learning Paths**: Options to follow intuition-first or comprehension-first learning approaches.
- **Real-Time Feedback**: Immediate auditory and visual feedback on played notes, chords, and intervals.
- **User-Friendly Interface**: An intuitive UI built with React and Redux for smooth user experience.
- **Calibration Tools**: Simple calibration process to align projections accurately with physical piano keys.
- **Expandable Content**: Modular design allowing for the addition of advanced lessons and features in future versions.

---

## Technology Stack

- **Frontend**: React, Redux
- **MIDI Handling**: WebMidi.js
- **Visualization**: SVGs, simple shapes (with potential future integration of advanced libraries like Three.js)
- **Language**: JavaScript (with consideration for future TypeScript integration)
- **Version Control**: Git (GitHub repository)
- **Testing**: Jest (unit testing)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

---

## Getting Started

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- A **MIDI-capable piano** connected to your computer via MIDI to USB cable.
- A **video projector** connected to your computer.
- Optional: **White cardboard with projection paint** for the music sheet display area.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/interactive-music-theory.git
   cd interactive-music-theory
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm start
   ```

4. **Access the Application**

   - Open your browser and navigate to `http://localhost:3000`.

### Calibration

- **Piano Keys Projection Calibration**

  - Upon first launch, the app will guide you through calibrating the projection onto your piano keys.
  - Follow the on-screen instructions to map the physical keys to the projected visuals.

- **Music Sheet Display Calibration**

  - Adjust the projector or use the in-app tools to align the content with your sheet surface area.

---

## Roadmap

This project is a work in progress. Below is the roadmap with milestones to track progress:

### **Phase 1: Setup and Proof of Concept (POC)**

#### Project Initialization

- [x] **Repository Setup**
  - Initialize GitHub repository with initial planning documents.
- [x] **Environment Setup**
  - Select technology stack (JavaScript with React and Redux).
  - Configure project with Webpack and Babel.
- [x] **Basic README Creation**
  - Draft initial README with project overview and setup instructions.

#### Hardware Acquisition and Setup

- [x] **Piano Connection**
  - Acquire MIDI to USB cables.
  - Test basic MIDI communication with the piano.
- [ ] **Projector Setup**
  - Acquire necessary projector cables.
  - Set up the projector for piano keys and sheet surface projection.

#### Initial Software Development

- [x] **MIDI Communication**
  - Implement code to read MIDI input and send MIDI output using WebMidi.js.
- [ ] **Basic Projection Mapping**
  - Develop simple projections onto piano keys.
  - Display static note labels.

#### Early Course Structure Development

- [ ] **Define Core Content**
  - Identify key music theory topics for the introductory course.
- [ ] **Outline Lesson Structure**
  - Create an outline of lessons and exercises focusing on recognition and basic understanding.

#### Early Testing

- [ ] **Internal Testing**
  - Test system functionality internally.
- [ ] **Feedback Collection**
  - Gather feedback to refine initial features.

---

### **Phase 2: Minimum Viable Product (MVP)**

#### Enhanced Piano Functionality

- [x] **Note and Interval Detection**
  - Implement logic to detect notes and intervals played on the piano.
- [ ] **Real-Time Feedback**
  - Provide immediate auditory feedback for correct/incorrect notes.

#### Basic User Interface Development

- [ ] **Functional UI**
  - Create a simple interface for lesson selection and interaction.
- [ ] **Settings and Preferences**
  - Allow users to adjust basic settings.

#### Basic Projection Features

- [ ] **Visual Feedback**
  - Project real-time visual cues onto piano keys.
- [ ] **Synchronization Testing**
  - Ensure synchronization between MIDI input and projections.

#### Initial Course Content Integration

- [ ] **Lesson Development**
  - Integrate first lessons covering note names and basic chords.
- [ ] **Exercise Creation**
  - Create exercises for practicing notes and chords.

#### User Testing and Feedback

- [ ] **Pilot Testing**
  - Conduct tests with a small group of users.
- [ ] **Iterative Improvements**
  - Refine system based on feedback.

---

### **Phase 3: Version 1.0 (v1.0) Release**

#### Full Integration and Advanced Features

- [ ] **Enhanced MIDI Communication**
  - Optimize MIDI input/output for accuracy and latency.
- [ ] **Advanced Visualization**
  - Implement visualizations for complex concepts (e.g., chord progressions).
- [ ] **Expanded Feedback**
  - Include feedback on rhythm accuracy and dynamics.

#### Polished User Interface and Experience

- [ ] **UI/UX Design**
  - Design an intuitive and visually appealing interface.
- [ ] **Accessibility Features**
  - Incorporate options for users with disabilities.
- [ ] **Onboarding and Tutorials**
  - Develop guided onboarding for new users.

#### Advanced Course Content and Adaptive Learning

- [ ] **Content Expansion**
  - Add advanced topics (e.g., harmony, rhythm patterns).
- [ ] **Adaptive Learning Paths**
  - Implement a system that adjusts difficulty based on performance.

#### Comprehensive Assessment and Progress Tracking

- [ ] **Advanced Evaluation**
  - Develop detailed assessments for understanding and skill development.
- [ ] **Progress Tracking**
  - Implement features to track user progress over time.

#### Extensive Testing and Quality Assurance

- [ ] **User Testing**
  - Test with a broader audience.
- [ ] **Cross-Platform Testing**
  - Ensure compatibility with different pianos and projectors.
- [ ] **Bug Fixes and Optimization**
  - Identify and fix bugs; optimize performance.

#### Documentation and Deployment Preparation

- [ ] **Comprehensive Documentation**
  - Update all documentation for users and developers.
- [ ] **Deployment**
  - Finalize deployment process for target environments.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

   - Click the "Fork" button at the top of this repository.

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Description of your changes"
   ```

4. **Push to Your Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

   - Navigate to the original repository and click "New Pull Request".

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

- **Project Maintainer**: Basile Maille
- **Email**: maille.basile@gmail.com
