import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";
import project4 from "../assets/projects/project-4.jpg";
import project5 from "../assets/projects/project-5.jpeg";
import project6 from "../assets/projects/project-6.jpeg";
import project7 from "../assets/projects/project-7.jpeg";
import project8 from "../assets/projects/project-8.jpeg";
import project9 from "../assets/projects/project-9.jpeg";
import project10 from "../assets/projects/project-10.jpeg";
import project11 from "../assets/projects/project-11.jpeg";
import project12 from "../assets/projects/project-12.jpeg";

export const HERO_CONTENT = `I am a passionate full-stack developer with a strong foundation in building efficient, user-centric applications. With hands-on experience spanning both professional work and internships, I specialize in front-end technologies such as React, HTML, CSS, and JavaScript, and back-end frameworks like Node.js,Django and Python. I have a proven track record of delivering impactful projects, such as enhancing GSLB operations at Verizon to prevent outages and developing automation tools like OneCLI for SRE engineers. Additionally, I have worked on various AI/ML projects, including a Resume Scorer, Text Rephraser/Humanizer, and Weather Prediction and Reporting using AI. My goal is to craft scalable and innovative solutions that solve real-world problems while enhancing user experiences.`;

export const ABOUT_TEXT = `I am a dedicated software engineer with 2 years of full-time experience and 8 months of internships across two companies. My journey in software engineering began with building web applications, which eventually led me to Verizon, where I worked on innovative projects that enhanced operational efficiency and reliability. Currently, I am pursuing a master's degree in Computer Science at the University at Buffalo, specializing in AI/ML.I have explored AI and machine learning through academic work and projects, incorporating LLMs into applications like resume scoring, text rephrasing, and weather prediction. These experiences have deepened my understanding of cutting-edge technologies and their practical applications.I enjoy learning new things, solving challenging problems, and staying curious about advancements in technology. In my free time, I love to cook, blending creativity with precision, much like my approach to coding. I am excited to continue tackling challenges and contributing to impactful solutions.`;

export const EXPERIENCES = [
  {
    year: "2022 JUL - 2024 JUL",
    role: "Software Development Engineer",
    company: "Verizon",
    description: `Collaborated with a team to develop and enhance multiple pages in the SRE Portal, focusing on automation and reducing toil for SRE engineers. Played a key role in improving the GSLB operations page, achieving a 60% boost in efficiency by implementing locking mechanisms to prevent simultaneous outages across data centers, ensuring high reliability and availability. Contributed to the development of OneCLI, an automation tool that streamlined workflows and increased productivity for SRE teams. Leveraged technologies such as JavaScript, React, Python, and Node.js to deliver scalable, user-centric solutions. Regularly interacted with stakeholders to gather requirements and align project outcomes with business goals`,
    technologies: ["Javascript", "React.js", "Node.js","Express.js", "MongoDB" ,"SQL","InfluxDB","Python","Jenkins","Ansible","HTML","CSS","Flask","AWS","Shell Scripting","Node-Red"],
  },
  {
    year: "2022 JAN - 2022 JUN",
    role: "Software Engineer Intern",
    company: "Ushur",
    description: `Worked as a Software Engineer Intern at Ushur on SaaS platform, where I dedicated time to learning AWS services like EC2, SQS, SNS and S3 ,as well as the Go programming language, to effectively contribute to the Ushur platform. Leveraged these technologies to enhance platform functionality and improve system performance. Demonstrated adaptability and a commitment to learning new tools and technologies while working in a dynamic, fast-paced environment.`,
    technologies: ["HTML", "CSS", "AWS", "GoLanguage","MicroServices","AWS-SQS","AWS-SNS","AWS-EC2","AWS-S3"],
  },
  {
    year: "2021 MAY - 2021 JUN",
    role: "Software Development Intern",
    company: "Bioclinica",
    description: `Worked as a Software Developer Intern at Bioclinica, where I designed and implemented a project called AUTOTRANSLATOR. This application utilized Django, Python, HTML, CSS, and JavaScript to enable users to upload document files, translate them from over 150 languages to English, and download the translated files. Integrated MySQL for efficient database management and ensured a seamless user experience with a robust front-end and back-end system. This application significantly simplified the process of proofreading documents and reduced toil, enhancing overall productivity and user efficiency. Demonstrated strong problem-solving skills and delivered a practical solution to address multilingual document management challenges.`,
    technologies: ["Python", "Django", "HTML", "CSS","JavaScript","MYSQL"],
  },
];

export const PROJECTS = [
  {
    title: "Personal Portfolio Website",
    image: project5,
    description:
      "Developed a fully functional and responsive portfolio website showcasing projects, professional experiences, and personal details. The website features dedicated sections for projects, work experience, contact information, and an About Me page. Designed an intuitive and user-friendly interface using HTML, CSS, and JavaScript, ensuring seamless navigation across devices. Incorporated modern design principles and interactive elements to provide an engaging user experience. The website serves as a comprehensive platform for showcasing skills and achievements, offering a professional online presence.",
    technologies: ["HTML", "CSS", "React", "Node.js", "Javascript","Framer Motion"],
  },
  {
    title: "Imagify SaaS Platform",
    image: project6,
    description:
      "Imagify is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to convert text prompts into images using the Clipdrop API. The platform features secure user authentication with account management, a credit-based system for generating images, and planned integration with payment gateways like Razorpay or Stripe for purchasing additional credits. Users can input text descriptions to generate images instantly, with credits deducted for each generation. You can try it at https://frontend-verse2vision.onrender.com/",
    technologies: ["HTML", "CSS", "Angular", "Firebase"],
  },
  {
    title: "WeatherWise",
    image: project7,
    description:
      "WeatherWise is an interactive weather application that not only provides real-time weather updates and a 5-day forecast for any city but also leverages AI to generate dynamic, human-like descriptions of the weather. By integrating the OpenAI API, WeatherWise transforms standard weather data into engaging, AI-powered summaries that provide users with a richer, more personalized weather experience. The app uses the OpenWeatherMap API for accurate weather data and Streamlit for a simple, intuitive interface. Key features include detailed current weather updates (temperature, humidity, pressure, and wind speed) and a comprehensive weekly forecast with daily descriptions and temperature ranges. ",
    technologies: ["Python", "Streamlit", "OpenAI"],
  },
  {
    title: "Fake News Prediction",
    image: project4,
    description:
      "The Fake News Prediction Model is an application of machine learning and natural language processing (NLP) to identify whether a news article is real or fake. Using Python and libraries like NLTK, scikit-learn, and pandas, I processed and analyzed text data through techniques such as stopword removal, stemming, and TF-IDF vectorization. The model utilizes a Logistic Regression classifier, trained on a Kaggle dataset containing labeled news articles, with an 80-20 train-test split for evaluation. To make the model interactive, I integrated it into a Streamlit web application, enabling real-time predictions. This project demonstrates my ability to apply NLP and machine learning techniques to solve real-world problems related to misinformation and showcases my skills in text data processing and model building.",
    technologies: ["Python","Pandas","Numpy","NLTK","Scikit-Learn","Streamlit","Machine Learning","Supervised Learning"],
  },

  {
    title: "NLP ToolKit",
    image: project8,
    description:
      "The NLP Toolkit is a customized natural language processing tool powered by Hugging Face Transformers, designed to perform a variety of tasks including code summarization, text summarization, sentiment analysis, text rephrasing, and humanizing text. Built using Streamlit, this interactive web application provides users with easy-to-use features for different NLP needs. The toolkit allows users to input code or text, and it generates outputs such as concise code summaries, clear text summaries, sentiment analysis with confidence scores, rephrased text for clarity, and more conversational or human-like alternatives for technical language. This project leverages advanced NLP models to solve real-world text processing challenges, providing high-quality and user-friendly solutions.",
    technologies: ["Python","Streamlit","HuggingFace transformers","facebook/bart-large-cnn","GEN AI","ML"],
  },

  {
    title: "PDF-Insight",
    image: project9,
    description:
      "The PDF Query Assistant is a Streamlit-based web application that enables users to upload multiple PDF files and ask detailed questions about their content. Leveraging powerful AI models and frameworks, this app processes the extracted text using OpenAI Embeddings for vectorization and FAISS for efficient storage and retrieval of relevant text chunks. The app employs Google Gemini-Pro for generating context-aware, detailed responses to user queries, ensuring accurate answers from the PDF data. Additionally, LangChain orchestrates the integration of these components for seamless query handling. This project is designed for document analysis, making it particularly useful for extracting and interacting with information from large documents, such as research papers, legal documents, or technical manuals. Users can easily upload PDFs, interact with the content, and receive precise answers based on the document's text.",
    technologies: ["Python","LangChain","Google-Gemini-Pro","FAISS","OpenAI Embeddings","GEN AI"],
  },

  {
    title: "Diabetics Disease Risk Prediction Model",
    image: project4,
    description:
      "The Diabetes Risk Prediction model was developed as part of coursework of Data Intensive Computing at the University at Buffalo, using a diabetes dataset from Kaggle.The project involved performing exploratory data analysis (EDA) and data preprocessing to clean and prepare the data for modeling. Various machine learning algorithms were tested, including Logistic Regression, Random Forest, Support Vector Machines, Neural Networks, and K-Nearest Neighbors. After evaluating the performance of these models, the Random Forest model, when tuned for optimal performance, provided the best results for predicting the risk of diabetes. This project applies machine learning techniques to real-world healthcare data to make accurate predictions.",
    technologies: ["Python","Pandas","Numpy","Seaborn","Scikit-learn","Matplotlib","Logistic Regression","SVM","Random Forest,Neural Network","Random Forest(Tuned)","K-NN","Machine Learning"],
  },

  {
    title: "Reinforcement Learning Project",
    image: project10,
    description:
      "As part of the Introduction to Machine Learning coursework at the University at Buffalo, we developed a reinforcement learning project exploring SARSA and Double Q-Learning in a custom-designed grid-world environment.The environment featured a 5x5 grid representing a grid world with various states, actions, rewards and penalities. Elements like traps added complexity, while the agent aimed to reach the goal state while avoiding termination states.The project involved implementing SARSA to update Q-values and employing an epsilon-greedy policy for action selection, balancing exploration and exploitation. We analyzed the impact of hyperparameters, including learning rate, discount factor, and epsilon decay, on the agent's performance. Additionally, we visualized the learned policy and evaluated a greedy policy derived from the trained Q-table. Through experimentation, we gained insights into reinforcement learning dynamics, the importance of hyperparameter tuning, and the effectiveness of SARSA and Double Q-Learning for policy optimization in deterministic/stochastic environments",
    technologies: ["Python","Gym","Pandas","Numpy","Matplotlib","Machine Learning","Reinforcement Learning"],
  },

  {
    title: "Personal AI Trainer",
    image: project12,
    description:
      "The Personal AI Trainer is an innovative project developed in response to the need for contactless solutions during the COVID-19 pandemic. Leveraging the MediaPipe framework and OpenCV tools, the system enables interactive, hands-free device control and serves as a personalized training assistant. By incorporating machine learning models, it enhances user interaction, making the system intuitive and responsive to movements. The project addresses the demand for hygienic, touch-free interaction, especially in environments requiring physical distancing or fitness training. Using Python as the programming language, along with MediaPipe and OpenCV, this project leverages expertise in computer vision and AI, offering a seamless, safe, and convenient user experience.",
    technologies: ["Machine Learning","OpenCV","MediaPipe","Python"],
  },

  {
    title: "FrontEnd for E-Commerce Webiste",
    image: project11,
    description:
      "Designed and Developed frontend for an E-Commerce Webiste",
    technologies: ["HTML", "CSS", "Javascript"],
  },
];

export const CONTACT = {
  address: "1525 Amherst Manor Drive ,Buffalo ,NY ",
  // phoneNo: "",
  email: "likhithakodali@gmail.com",
};
