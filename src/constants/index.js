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

// Company logos
import busynessLogo from "../assets/busyness-logo.jpeg";
import wafuLogo from "../assets/wafu-logo.jpeg";

export const HERO_CONTENT = `I am a data-driven analyst and aspiring data scientist with expertise in transforming complex operational data into actionable insights. With 3+ years of professional experience in data analysis, business intelligence, and machine learning, I specialize in SQL, Python, Power BI, and cloud platforms like AWS. I have a proven track record of designing and deploying end-to-end data solutions that drive operational efficiency, reduce costs, and enable data-informed decision-making. I combine technical expertise with strong communication skills to translate insights for both technical and non-technical stakeholders.`;

export const ABOUT_TEXT = `I am a Business Data Analyst with 3+ years of hands-on experience at Busyness.app and WAFU Technologies, where I've built scalable data solutions that directly impact business outcomes. Currently pursuing a Master's degree in Computer Science at SUNY Buffalo, with a focus on advanced analytics and machine learning techniques.

My expertise spans full-stack data analytics: from ETL pipeline development and data warehousing with Snowflake and AWS Glue, to building 10+ interactive Power BI and Tableau dashboards that serve 15+ stakeholders. I've optimized SQL queries processing 1M+ transactional records and developed machine learning models for churn prediction and demand forecasting.

I'm passionate about solving real-world problems through data—whether it's identifying operational inefficiencies that improved output consistency by 10%, or building AI-powered tools that reduce analysis time by 40%. I thrive at the intersection of technical depth and business impact, translating complex analyses into actionable insights for non-technical audiences.`;

export const EXPERIENCES = [
  {
    year: "2022 JAN - 2024 DEC",
    role: "Business Data Analyst II",
    company: "Busyness.app",
    logo: busynessLogo,
    description: `Analyzed warehouse and fulfillment data across 6+ operational systems, translating operational metrics into actionable insights used in weekly and monthly performance reviews. Designed and maintained 10+ end-to-end Power BI solutions with complex data models and DAX measures to monitor productivity, throughput, labor utilization, and service-level adherence. Optimized SQL queries to extract, clean, and transform 1M+ transactional records, improving data reliability for downstream reporting. Identified recurring inefficiencies through historical trend analysis, contributing to process changes that improved daily output consistency by approximately 10%. Integrated data from warehouse management, timekeeping, and inventory systems into unified datasets, improving visibility into operational performance.`,
    technologies: ["SQL", "T-SQL", "Power BI", "DAX", "Python", "AWS", "Excel", "Data Analysis", "ETL", "Business Intelligence"],
  },
  {
    year: "2020 MAY - 2021 MAY",
    role: "Data Analyst",
    company: "WAFU Technologies",
    logo: wafuLogo,
    description: `Transformed raw application and operational data into structured, analysis-ready datasets through extraction, schema normalization, and data cleaning workflows. Unified data from multiple relational sources using SQL-based transformations, enabling consistent reporting and cross-team analysis. Produced and maintained 8+ Excel and Power BI reports to monitor system usage patterns, operational trends, and recurring issues for stakeholders. Investigated data inconsistencies using targeted SQL queries, resolving discrepancies surfaced during reporting. Responded to 10+ ad-hoc analytical requests from operations and support teams, delivering timely insights to support decision-making.`,
    technologies: ["SQL", "Python", "Power BI", "Excel", "Data Engineering", "Database Management", "Business Analysis"],
  },
];

export const PROJECTS = [
  {
    title: "Telco Customer Churn Prediction",
    image: project1,
    description:
      "Built churn prediction models using Logistic Regression, XGBoost, and Random Forest, analyzing 500,000+ customer records to identify key behavioral churn drivers. Launched an HTML-based web application to surface churn risk insights with an intuitive UI, supporting targeted retention strategies. This project demonstrates expertise in classification modeling, feature engineering, and deploying ML solutions for real-world business impact.",
    technologies: ["Python", "Scikit-learn", "XGBoost", "Random Forest", "Pandas", "Logistic Regression", "HTML", "Machine Learning"],
  },
  {
    title: "Exploratory Data Analysis using LangChain",
    image: project2,
    description:
      "Conducted exploratory data analysis on 14,000+ data science job listings, identifying trends in salary, role seniority, and remote work adoption. Leveraged LangChain and OpenAI APIs to generate natural-language insights, reducing manual exploratory analysis time by approximately 40%. This project showcases the integration of LLMs with data analysis workflows for accelerated insights generation.",
    technologies: ["Python", "LangChain", "OpenAI API", "Pandas", "Data Analysis", "Natural Language Processing", "Exploratory Data Analysis"],
  },
  {
    title: "Citi Bike Trip Demand Prediction System",
    image: project3,
    description:
      "Designed an end-to-end machine learning pipeline to forecast hourly Citi Bike demand using Python, Pandas, and LightGBM, processing 1M+ historical trip records. Built baseline and advanced models using lag features and PCA-based feature reduction, evaluating 20+ experiment runs in MLflow and achieving a 12-15% MAE improvement. Deployed interactive Streamlit dashboards to visualize hourly demand predictions, providing actionable insights for resource allocation.",
    technologies: ["Python", "LightGBM", "Pandas", "Scikit-learn", "PCA", "MLflow", "Streamlit", "Time Series Forecasting", "Machine Learning"],
  },
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
];

export const CONTACT = {
  address: "Buffalo, New York",
  phoneNo: "+1-971-264-8878",
  email: "rithvik.illandula@gmail.com",
  linkedin: "https://www.linkedin.com/in/rithvik-illandula/",
  github: "https://github.com/RITHVIKILLANDULA",
};
