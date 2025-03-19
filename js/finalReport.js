/**
 * Candidate Assessment Processing & Submission Script
 * 
 * This script handles:
 * 1. Calculating candidate trait scores based on responses.
 * 2. Generating reports and visual charts.
 * 3. Computing job-specific scores based on predefined matrices.
 * 4. Submitting candidate data to the backend.
 * 5. Clearing local storage upon successful submission.
 */

// ===============================================
//              TRAIT MAPPING DATA
// ===============================================


const traitMapping = {
  Extroversion: [49, 20, 3, 52, 8, 50, 60, 9, 54],
  Conscientiousness: [55, 16, 33, 13, 39, 24, 31, 23, 51, 1, 53, 46, 18],
  Openness: [11, 19, 25, 6, 59, 15, 27, 36, 44, 56, 41, 5],
  Agreeableness: [35, 40, 10, 17, 21, 47, 38, 2, 44, 56],
  Emotional_Stability: [26, 14, 37, 30, 42, 29, 47, 57, 43],
  Professional_Culture_Profile: [
    20, 3, 9, 54, 46, 11, 6, 59, 15, 44, 56, 35, 40, 38, 2, 4, 7, 12,
  ],
  Communication_Skills: [8, 50, 60, 35, 40, 10, 2, 32, 4, 34, 12],
  Critical_Thinking: [31, 27, 36, 45, 28, 48],
  Leadership_Ability: [50, 60, 32, 4, 22, 7, 57, 58, 12],
};


// ===============================================
//          SCORE RANGES FOR TRAITS
// ===============================================



const ranges = {
  Extroversion: [
    [9, 19],
    [20, 30],
    [31, 41],
    [42, 52],
    [53, 63],
  ],
  Conscientiousness: [
    [13, 28],
    [29, 44],
    [45, 59],
    [60, 75],
    [76, 91],
  ],
  Openness: [
    [12, 26],
    [27, 40],
    [41, 55],
    [56, 69],
    [70, 84],
  ],
  Agreeableness: [
    [10, 21],
    [22, 33],
    [34, 45],
    [46, 57],
    [58, 70],
  ],
  Emotional_Stability: [
    [9, 19],
    [20, 30],
    [31, 41],
    [42, 52],
    [53, 63],
  ],
  Professional_Culture_Profile: [
    [18, 39],
    [40, 60],
    [61, 82],
    [83, 103],
    [104, 126],
  ], // Added based on image
  Communication_Skills: [
    [11, 23],
    [24, 37],
    [38, 50],
    [51, 64],
    [65, 77],
  ],
  Critical_Thinking: [
    [6, 12],
    [13, 19],
    [20, 27],
    [28, 34],
    [35, 42],
  ],
  Leadership_Ability: [
    [9, 19],
    [20, 30],
    [31, 41],
    [42, 52],
    [53, 63],
  ],
};


// ===============================================
//       RESPONSE LEVELS FOR SCORE RANGE
// ===============================================




const responses = {
  Extremely_Low: "The scores indicate an Extremely Low level of ",
  Low: "The scores indicate a Low level of ",
  Average: "The scores indicate an Average level of ",
  High: "The scores indicate a High level of ",
  Extremely_High: "The scores indicate an Extremely High level of ",
};

const descriptions = {
  Extroversion: {
    Extremely_Low:
      "The scores indicate an Extremely Low level of Extroversion. This suggests a strong preference for minimal social interaction, particularly in unfamiliar settings. Engaging in conversations with new people may feel uncomfortable, and independent work is likely preferred over team-based tasks. Initiative in group activities or networking efforts is minimal, and collaboration may be perceived as draining rather than energizing.",
    Low: "The scores indicate a Low Level of Extroversion, reflecting a preference for limited social engagement. While participation in group settings is manageable when necessary, working independently tends to feel more comfortable. Contributions to discussions may occur when prompted, but there is little inclination to take the lead or actively seek connections. Networking and teamwork might feel more like responsibilities than inherently enjoyable experiences.",
    Average:
      "The scores indicate an Average Level of Extroversion, reflecting a balanced approach to social interaction. Comfort is found in both independent work and team settings, with adaptability depending on the situation. Participation in discussions and group activities occurs when necessary, though there is no strong inclination to actively seek out social opportunities. Networking and collaboration are generally approached with neutrality, neither serving as a source of energy nor feeling particularly draining.",
    High: "The scores indicate a High Level of Extroversion, demonstrating a natural inclination toward social engagement and group environments. Confidence in sharing ideas and leading team discussions is evident, with collaboration serving as a source of motivation. There is a strong tendency to initiate activities that promote teamwork and foster connections. Building professional relationships comes naturally, and networking is viewed as a valuable opportunity for growth and development.",
    Extremely_High:
      "The scores indicate an Exceptionally High Level of Extroversion, reflecting a strong enthusiasm for social engagement and collaboration. There is a natural inclination to seek out new connections, confidently lead discussions, and take on central roles in group settings. Team-oriented environments feel intuitive, with a proactive approach to networking and relationship-building. Energy and creativity are enhanced through continuous interaction, making collaboration a key driver of motivation and performance.",
  },
  // Add similar for all other traits (can use your provided descriptions directly)
  Conscientiousness: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Conscientiousness, suggesting potential challenges in maintaining focus, organization, and adherence to deadlines. Structuring tasks with detailed planning or prioritization may not come naturally, which can impact efficiency and follow-through on commitments. Routine or demanding responsibilities may feel difficult to sustain, and attention to detail might require additional effort. Taking prompt accountability for mistakes may also necessitate a more deliberate approach.",
    Low: "The scores indicate a Low Level of Conscientiousness, suggesting some difficulty in maintaining consistent organization and task management. While deadlines can be met, they may require additional effort and external motivation. Tasks that feel tedious may lead to occasional procrastination, and while there is a sense of responsibility, addressing mistakes promptly may not always be an immediate priority. Staying focused without structured guidance or clear motivation may present challenges.",
    Average:
      "The scores indicate an Average Level of Conscientiousness, reflecting a balanced approach to organization, responsibility, and task management. Deadlines are generally met, and tasks are planned when necessary, though occasional procrastination or oversight may occur. There is an ability to recognize and correct mistakes when needed, and while focus and productivity are maintained, they may not always be executed with the highest level of precision.",
    High: "The scores indicate a High Level of Conscientiousness, characterized by strong organization, responsibility, and a commitment to producing quality work. Deadlines are consistently met, even in high-pressure situations, with careful planning and prioritization of tasks. A detail-oriented approach minimizes procrastination, and accountability is demonstrated through prompt recognition and correction of mistakes. Focus, adherence to guidelines, and the maintenance of high standards come naturally, contributing to a disciplined and structured work style.",
    Extremely_High:
      "The scores indicate an Exceptionally High Level of Conscientiousness, reflected in strong discipline, organization, and reliability. Goals are proactively set with detailed planning, ensuring consistent delivery of high-quality results ahead of deadlines. A meticulous approach to detail minimizes errors, and a strong sense of accountability drives continuous self-improvement. High personal standards, unwavering focus, and a commitment to responsibility remain consistent across various circumstances, reinforcing a structured and results-driven work ethic.",
  },
  Openness: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Openness, suggesting a strong preference for familiar routines and established methods. Comfort is found in what is known and tested, with limited inclination toward exploring new approaches or unfamiliar ideas. Change may feel unnecessary or overwhelming, and there is a tendency to rely on proven methods rather than seeking out novel learning opportunities. Engagement with perspectives that challenge existing beliefs may be minimal, reinforcing a structured and predictable approach to problem-solving and decision-making.",
    Low: "The scores indicate a Low Level of Openness, reflecting a cautious approach to new ideas and changes. Preference is given to proven methods, with adaptability emerging primarily when necessary rather than by choice. While new experiences and learning opportunities are not actively avoided, they may not be sought out regularly. Creative problem-solving and unconventional thinking may not be the default approach, and integrating feedback into established routines can require additional effort. Stability and familiarity are valued, contributing to a practical and structured mindset.",
    Average:
      "The scores indicate a Moderate Level of Openness, reflecting a balanced approach to new ideas and experiences. While familiar methods are valued, adaptability is present when circumstances require it. Engagement with diverse perspectives and creative problem-solving occurs as needed, though seeking novelty is not a constant priority. Learning and growth are embraced within practical boundaries, ensuring a thoughtful yet measured approach to change and innovation.",
    High: "The scores indicate a High Level of Openness, highlighting a strong inclination toward exploration, learning, and adaptability. New experiences and challenges are actively pursued, with change being viewed as an opportunity for growth. Creativity and innovation play a significant role in problem-solving, and diverse perspectives are welcomed. A flexible mindset allows for the integration of feedback and the willingness to experiment with unconventional approaches.",
    Extremely_High:
      "The scores reflect an Exceptionally High Level of Openness, characterized by intellectual curiosity, adaptability, and a strong desire for continuous learning. There is a natural inclination to seek out new experiences, challenge existing perspectives, and explore unconventional ideas. Creativity plays a central role in problem-solving, and feedback is readily embraced as a tool for refinement and growth. Change is not just accepted but actively pursued, viewed as an essential component of progress and personal development.",
  },
  Agreeableness: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Agreeableness. Prioritizing personal perspectives over those of others is a common tendency, which may make collaboration and compromise feel less natural. Independent work is often preferred over team-based efforts, and navigating interpersonal challenges, such as conflict resolution or trust-building, may require conscious effort, particularly in situations that demand flexibility or empathy.",
    Low: "The scores indicate a Low Level of Agreeableness. While collaboration is possible when necessary, fully embracing compromise or considering diverse perspectives may not come naturally. Interactions remain respectful, but offering support without a clear personal benefit may feel less intuitive. Building trust and fostering teamwork may require additional effort, as developing strong collaborative relationships tends to take time.",
    Average:
      "The scores indicate an Average Level of Agreeableness. There is a balanced approach to cooperation, allowing for both independent decision-making and teamwork when necessary. Understanding different perspectives and maintaining respectful interactions come naturally, though willingness to compromise or resolve conflicts may vary depending on the situation. Providing support to others feels natural, particularly when it aligns with personal values or objectives.",
    High: "The scores indicate a High Level of Agreeableness. There is a strong inclination toward maintaining positive relationships, demonstrating empathy, and cooperating with others. Understanding different perspectives comes naturally, and support is offered readily without expectation of reciprocation. Conflicts are handled with a calm and solution-focused mindset, prioritizing harmony and constructive resolutions that strengthen trust and teamwork.",
    Extremely_High:
      "The scores indicate an Extremely High Level of Agreeableness. There is a strong emphasis on fostering harmony, demonstrating empathy, and maintaining cooperative relationships. Understanding and respecting diverse viewpoints is second nature, and support is offered unconditionally. Conflict resolution is approached with sensitivity and fairness, reinforcing trust and strengthening team dynamics.",
  },
  Emotional_Stability: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Emotional Stability. High-pressure situations may feel overwhelming, leading to heightened tension, anxiety, or difficulty maintaining focus. Stress and criticism can significantly impact mood and productivity, often resulting in overanalyzing potential problems. Minor setbacks may cause frustration, and sustaining a positive outlook during challenging circumstances can require considerable effort.",
    Low: "The scores indicate a Low Level of Emotional Stability. High-pressure situations may sometimes lead to feelings of nervousness or anxiety, making it challenging to maintain focus and composure. While productivity is possible, stress can result in concerns about potential setbacks. Criticism or minor difficulties may influence mood, and sustaining motivation during challenges may require conscious effort.",
    Average:
      "The scores indicate an Average Level of Emotional Stability. In most situations, a balanced and composed demeanor is maintained, even under pressure. Occasional stress or anxiety may arise, but focus and productivity generally remain unaffected. While setbacks or criticism can influence mood, optimism is typically sustained, with some time needed to regain motivation during particularly challenging circumstances.",
    High: "The scores indicate a High Level of Emotional Stability. Challenges and high-pressure situations are managed with composure, allowing for sustained focus and productivity. While occasional stress or frustration may occur, it does not significantly impact performance or decision-making. Criticism is handled constructively, and optimism is maintained, ensuring motivation and resilience in the face of setbacks.",
    Extremely_High:
      "The scores indicate an Extremely High Level of Emotional Stability. Even in high-pressure situations, composure and productivity are maintained without significant disruption. Challenges, criticism, and setbacks have little impact on performance or mood, allowing for consistent focus and resilience. A strong sense of optimism and adaptability ensures sustained motivation, making it possible to navigate difficulties with confidence and reliability.",
  },
  Communication_Skills: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Communication Skills. Expressing ideas clearly in conversations or writing may present challenges, sometimes leading to misunderstandings. Understanding different perspectives can require additional effort, and adjusting communication styles to suit various situations may not come naturally. With deliberate practice, these skills can be refined to improve clarity, adaptability, and meaningful interactions.",
    Low: "The scores indicate a Low Level of Communication Skills. Expressing thoughts clearly and concisely may sometimes be challenging, particularly when adapting to different audiences or contexts. While engagement in conversations is present, fully understanding and responding to others' perspectives may require additional effort. Conversations may occasionally feel unclear or require clarification, and conveying ideas in a structured manner might not always come naturally.",
    Average:
      "The scores indicate an Average Level of Communication Skills. In most situations, conveying ideas is done with clarity, and understanding different perspectives comes with reasonable effort. There is an ability to adjust communication style when needed, though certain discussions, particularly complex or nuanced ones, may require additional focus on clarity and active listening.",
    High: "The scores indicate a High Level of Communication Skills. Ideas are expressed with clarity and confidence, both in verbal and written forms. Active listening is a key strength, facilitating thoughtful understanding and responses. Communication style is adapted effectively to suit different individuals and contexts, fostering meaningful connections and productive discussions.",
    Extremely_High:
      "The scores indicate an Extremely High Level of Communication Skills. Ideas are conveyed with clarity and precision, with a natural ability to adapt communication styles across different contexts. Active listening is a well-developed strength, ensuring a strong understanding of diverse perspectives. These abilities enhance engagement in conversations and contribute to seamless collaboration with others.",
  },
  Critical_Thinking: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Critical Thinking. Approaching problems systematically or recognizing patterns that lead to effective solutions may not come naturally. Adapting to different situations can feel unfamiliar, and generating creative alternatives might not be an instinctive process. Problem-solving and decision-making may require additional effort when faced with complex or unfamiliar challenges.",
    Low: "The scores indicate a Low Level of Critical Thinking. Difficulties may arise in evaluating information objectively, identifying patterns, and considering multiple perspectives in problem-solving. Adapting reasoning to different contexts can require additional effort, and generating innovative solutions may not come intuitively. Analytical problem-solving can feel less natural, particularly in complex or unfamiliar situations, where structured evaluation and adaptability are more challenging to apply.",
    Average:
      "The scores indicate an Average Level of Critical Thinking. Logical analysis is applied effectively in problem-solving, with adaptability to different situations when necessary. While creative alternatives and complex evaluations may not always be the primary approach, routine challenges are managed competently. Problem-solving remains structured and practical, with room for further development in flexible and innovative thinking.",
    High: "The scores indicate a High Level of Critical Thinking. Problems are approached with careful consideration, incorporating pattern recognition and strategic adaptation based on the situation. Decision-making involves evaluating multiple factors, ensuring well-rounded judgments. Creativity is applied when necessary, enhancing problem-solving effectiveness across various contexts.",
    Extremely_High:
      "The scores indicate an Extremely High Level of Critical Thinking. Complex problems are analyzed with precision, recognizing underlying patterns and connections that inform strategic decision-making. Adaptability ensures effective problem-solving across diverse situations, with innovative thinking playing a key role in generating solutions. Evaluating multiple perspectives before drawing conclusions strengthens both reasoning and judgment.",
  },
  Leadership_Ability: {
    Extremely_Low:
      "The scores indicate an Extremely Low Level of Leadership Potential. Taking on leadership roles or guiding group efforts may present significant challenges, particularly in areas such as decision-making, conflict resolution, and fostering collaboration. Managing responsibilities in high-pressure situations can feel overwhelming, and asserting authority or influencing group direction may not come naturally. Leading with confidence and maintaining control over team dynamics might require additional effort and experience.",
    Low: "The scores indicate a Low Level of Leadership Potential. Leading teams, maintaining alignment toward shared goals, and addressing conflicts constructively may present occasional challenges. While supporting others’ ideas can come naturally, taking decisive actions and consistently managing team dynamics may require additional effort. Guiding a group effectively and ensuring productivity might not always feel intuitive, particularly in situations that demand quick decision-making or strong directional leadership.",
    Average:
      "The scores indicate an Average Level of Leadership Potential. Managing group efforts is approached with moderate confidence, allowing for effective guidance in discussions, support for team collaboration, and the ability to handle conflicts when necessary. Decision-making under pressure may vary, with certain situations requiring more assertiveness or strategic direction. Motivating a team and maintaining alignment toward shared objectives can be managed competently, though opportunities may exist to enhance consistency in leadership effectiveness across different contexts.",
    High: "The scores indicate a High Level of Leadership Potential. Leading group efforts is approached with confidence, fostering collaboration and ensuring alignment toward shared goals. Decision-making remains steady, even in high-pressure situations, with conflicts handled fairly and constructively. Team strengths are recognized and nurtured, contributing to overall group performance. The ability to guide discussions, provide direction, and maintain morale supports effective leadership across various contexts.",
    Extremely_High:
      "The scores indicate an Extremely High Level of Leadership Potential. Leading teams with clarity, decisiveness, and empathy comes naturally, ensuring that group efforts remain focused and productive. Collaboration is actively encouraged, fostering mutual respect and a cohesive team dynamic. Conflicts are managed constructively, with fair and strategic resolutions that maintain morale and efficiency. A strong ability to recognize individual strengths and delegate responsibilities effectively contributes to sustained team success. Leadership remains steady and influential across diverse situations, consistently driving teams toward their objectives.",
  },
  Professional_Culture_Profile: {
    Extremely_Low:
      "The candidate expresses limited alignment with workplace environments that prioritize teamwork, adaptability, and continuous growth. The candidate may prefer working independently, face challenges in adapting to new ideas, and may struggle with collaborative problem-solving or engaging with diverse perspectives. For employers, this may indicate a need for roles with more autonomy and less reliance on team dynamics. For candidates, focusing on developing interpersonal skills, openness to feedback, and adaptability can enhance professional growth and team integration.",
    Low: "The candidate reflects occasional difficulties in fully engaging with collaborative work settings. Candidate may show respect for colleagues and some flexibility but may prefer structured environments where roles and expectations are clearly defined. Employers might consider assigning these individuals tasks that allow for both independent contributions and gradual exposure to teamwork. The candidate can benefit from enhancing communication, embracing diverse viewpoints, and actively participating in team-based activities to strengthen their cultural fit.",
    Average:
      "The candidate demonstrates a balanced approach to teamwork and adaptability. Such individuals are generally comfortable working with others, can adjust to new situations when needed, and show respect for differing perspectives. For employers, this suggests a reliable team member who can function effectively in both collaborative and independent roles. The candidate may consider refining skills like conflict resolution, proactive networking, or consistently embracing feedback to maximize their impact within team environments.",
    High: "The candidate indicates strong interpersonal skills, adaptability, and a positive approach to collaboration. Candidate likely excels in team settings, actively support colleagues, and contribute to open, constructive communication. For employers, this reflects a candidate who can enhance team performance, navigate conflicts with ease, and adapt to dynamic work environments. The candidate is encouraged to continue leveraging these strengths, potentially preparing for leadership roles where these skills are critical.",
    Extremely_High:
      "The candidate reflects exceptional alignment with collaborative, growth-oriented work environments. The candidate excels at fostering inclusivity, adapting to diverse perspectives, and maintaining strong professional relationships. For employers, this suggests an individual who not only thrives in team dynamics but also actively contributes to shaping a positive work culture. The candidate shows capablility to inspire others, managing diverse teams, and driving continuous improvement within the organization.",
  },
};


// Job Specific Report


jobRoleFeedback = {
  PM: {
    Extroversion: {
      Extremely_Low:
        "A low to average level of extroversion is not preferable for a project manager role, as the position typically requires strong social engagement, assertiveness, and the ability to energize and coordinate teams effectively.",
      Low: "A low to average level of extroversion is not preferable for a project manager role, as the position typically requires strong social engagement, assertiveness, and the ability to energize and coordinate teams effectively.",
      Average:
        "A low to average level of extroversion is not preferable for a project manager role, as the position typically requires strong social engagement, assertiveness, and the ability to energize and coordinate teams effectively.",
      High: "A high level of extroversion aligns well with the demands of a project manager role, indicating strong social engagement , effective communication, and the ability to lead and motivate teams efficiently. This suggests the candidate is well-suited for the position.",
      Extremely_High:
        "A high level of extroversion aligns well with the demands of a project manager role, indicating strong social engagement , effective communication, and the ability to lead and motivate teams efficiently. This suggests the candidate is well-suited for the position.",
    },
    Conscientiousness: {
      Extremely_Low:
        "A low to average level of conscientiousness may not be ideal for a project manager, as the role demands structured decision-making, accountability, and consistent follow-through. Difficulty in maintaining organization and attention to detail could impact project timelines and overall efficiency.",
      Low: "A low to average level of conscientiousness may not be ideal for a project manager, as the role demands structured decision-making, accountability, and consistent follow-through. Difficulty in maintaining organization and attention to detail could impact project timelines and overall efficiency.",
      Average:
        "A low to average level of conscientiousness may not be ideal for a project manager, as the role demands structured decision-making, accountability, and consistent follow-through. Difficulty in maintaining organization and attention to detail could impact project timelines and overall efficiency.",
      High: "A high level of conscientiousness is crucial for a project manager, ensuring strong organizational skills, attention to detail, and reliability in meeting deadlines. A disciplined and goal-oriented approach supports effective planning, risk management, and successful project execution.",
      Extremely_High:
        "A high level of conscientiousness is crucial for a project manager, ensuring strong organizational skills, attention to detail, and reliability in meeting deadlines. A disciplined and goal-oriented approach supports effective planning, risk management, and successful project execution.",
    },
    Openness: {
      Extremely_Low:
        "A low to average level of openness may limit the ability to adapt to changing project demands and explore innovative solutions. Given the need for flexibility and forward-thinking in this role, a restricted openness level is not well-suited for effective project management.",
      Low: "A low to average level of openness may limit the ability to adapt to changing project demands and explore innovative solutions. Given the need for flexibility and forward-thinking in this role, a restricted openness level is not well-suited for effective project management.",
      Average:
        "A low to average level of openness may limit the ability to adapt to changing project demands and explore innovative solutions. Given the need for flexibility and forward-thinking in this role, a restricted openness level is not well-suited for effective project management.",
      High: "A high level of openness is essential for a project manager, enabling adaptability, creative problem-solving, and a proactive approach to new ideas. This trait supports strategic decision-making and flexibility in managing dynamic project requirements.",
      Extremely_High:
        "A high level of openness is essential for a project manager, enabling adaptability, creative problem-solving, and a proactive approach to new ideas. This trait supports strategic decision-making and flexibility in managing dynamic project requirements.",
    },
    Agreeableness: {
      Extremely_Low:
        "A moderate to lower level of agreeableness is beneficial for a project manager, ensuring assertiveness in decision-making, the ability to handle conflicts objectively, and a focus on achieving project goals efficiently. Maintaining a firm stance when required supports leadership effectiveness in high-stakes environments.",
      Low: "A moderate to lower level of agreeableness is beneficial for a project manager, ensuring assertiveness in decision-making, the ability to handle conflicts objectively, and a focus on achieving project goals efficiently. Maintaining a firm stance when required supports leadership effectiveness in high-stakes environments.",
      Average:
        "A moderate to lower level of agreeableness is beneficial for a project manager, ensuring assertiveness in decision-making, the ability to handle conflicts objectively, and a focus on achieving project goals efficiently. Maintaining a firm stance when required supports leadership effectiveness in high-stakes environments.",
      High: "Excessively high agreeableness may lead to difficulties in enforcing tough decisions, managing conflicts, or maintaining authority in a leadership position. While collaboration is important, an overly accommodating nature may hinder strong leadership in complex project dynamics.",
      Extremely_High:
        "Excessively high agreeableness may lead to difficulties in enforcing tough decisions, managing conflicts, or maintaining authority in a leadership position. While collaboration is important, an overly accommodating nature may hinder strong leadership in complex project dynamics.",
    },
    Emotional_Stability: {
      Extremely_Low:
        "Lower emotional stability may lead to difficulties in handling stress, responding to setbacks, or managing conflicts effectively. Given the demanding nature of project management, higher emotional stability is strongly preferred.",
      Low: "Lower emotional stability may lead to difficulties in handling stress, responding to setbacks, or managing conflicts effectively. Given the demanding nature of project management, higher emotional stability is strongly preferred.",
      Average:
        "Lower emotional stability may lead to difficulties in handling stress, responding to setbacks, or managing conflicts effectively. Given the demanding nature of project management, higher emotional stability is strongly preferred.",
      High: "A high level of emotional stability is essential for a project manager, ensuring resilience under pressure, rational decision-making, and effective leadership during challenging situations. Maintaining composure and adaptability enhances project execution and team confidence.",
      Extremely_High:
        "A high level of emotional stability is essential for a project manager, ensuring resilience under pressure, rational decision-making, and effective leadership during challenging situations. Maintaining composure and adaptability enhances project execution and team confidence.",
    },
    Communication_Skills: {
      Extremely_Low:
        "A project manager requires strong communication skills to lead teams, coordinate with stakeholders, and ensure seamless project execution. Limited ability to convey ideas, engage in discussions, or adapt communication styles can hinder leadership effectiveness, which is unsuitable for the role.",
      Low: "While this level of communication ability allows for functional team interactions and basic delegation of tasks, it may not always be sufficient for managing complex discussions, resolving conflicts, or maintaining clear coordination across multiple teams. While not an outright barrier, stronger communication skills would enhance performance in this role.",
      Average:
        "While this level of communication ability allows for functional team interactions and basic delegation of tasks, it may not always be sufficient for managing complex discussions, resolving conflicts, or maintaining clear coordination across multiple teams. While not an outright barrier, stronger communication skills would enhance performance in this role.",
      High: "While this level of communication ability allows for functional team interactions and basic delegation of tasks, it may not always be sufficient for managing complex discussions, resolving conflicts, or maintaining clear coordination across multiple teams. While not an outright barrier, stronger communication skills would enhance performance in this role.",
      Extremely_High:
        "Strong communication skills are essential for a project manager to articulate goals, lead meetings, negotiate with stakeholders, and maintain workflow efficiency. This level of communication ability ensures effective leadership and team coordination, making it highly suitable for the role.",
    },
    Critical_Thinking: {
      Extremely_Low:
        "A project manager must analyze complex situations, make strategic decisions, and adapt to evolving challenges. Limited critical thinking skills can hinder the ability to assess risks, identify solutions, and manage projects efficiently, making this range unsuitable for the role.",
      Low: "A project manager must analyze complex situations, make strategic decisions, and adapt to evolving challenges. Limited critical thinking skills can hinder the ability to assess risks, identify solutions, and manage projects efficiently, making this range unsuitable for the role.",
      Average:
        "Strong critical thinking skills enable a project manager to evaluate multiple perspectives, anticipate potential issues, and implement effective solutions. The ability to think critically enhances decision-making, risk management, and strategic planning, making this range highly suitable for the role.",
      High: "Strong critical thinking skills enable a project manager to evaluate multiple perspectives, anticipate potential issues, and implement effective solutions. The ability to think critically enhances decision-making, risk management, and strategic planning, making this range highly suitable for the role.",
      Extremely_High:
        "Strong critical thinking skills enable a project manager to evaluate multiple perspectives, anticipate potential issues, and implement effective solutions. The ability to think critically enhances decision-making, risk management, and strategic planning, making this range highly suitable for the role.",
    },
    Leadership_Ability: {
      Extremely_Low:
        "A project manager is responsible for guiding teams, making strategic decisions, and ensuring project success. Limited leadership skills can hinder the ability to delegate tasks, motivate teams, and handle conflicts, making this range unsuitable for the role.",
      Low: "A project manager is responsible for guiding teams, making strategic decisions, and ensuring project success. Limited leadership skills can hinder the ability to delegate tasks, motivate teams, and handle conflicts, making this range unsuitable for the role.",
      Average:
        "A project manager is responsible for guiding teams, making strategic decisions, and ensuring project success. Limited leadership skills can hinder the ability to delegate tasks, motivate teams, and handle conflicts, making this range unsuitable for the role.",
      High: "Strong leadership skills enable a project manager to inspire and direct teams effectively, maintain productivity, and manage challenges with confidence. This range ensures decisive leadership, clear communication, and effective team management, making it highly suitable for the role.",
      Extremely_High:
        "Strong leadership skills enable a project manager to inspire and direct teams effectively, maintain productivity, and manage challenges with confidence. This range ensures decisive leadership, clear communication, and effective team management, making it highly suitable for the role.",
    },
    Professional_Culture_Profile: {
      Extremely_Low:
        "This level indicates potential difficulties in adapting to the flexible and dynamic environments typical in project management, possibly impacting the candidate's effectiveness in managing diverse project teams.",
      Low: "The candidate may struggle with the highly collaborative and adaptive nature required in project management, which could affect their ability to lead projects effectively",
      Average:
        "Suitable for project management roles that require a balance of independent decision-making and collaborative project execution, indicating the candidate can handle typical project dynamics.",
      High: " Ideal for project management, where strong collaborative skills and adaptability are crucial for leading diverse teams and managing complex projects.",
      Extremely_High:
        "The candidate's exceptional skills in collaboration and adaptability make them highly suitable for senior project management roles, likely excelling in leading large teams and complex projects.",
    },
  },
  Clerical: {
    Extroversion: {
      Extremely_Low:
        "A low to average level of extroversion is well-suited for a clerical role, as it suggests a preference for independent work, focus on tasks, and minimal need for social interaction. This aligns with the job’s structured and detail-oriented nature, making the candidate a good fit.",
      Low: "A low to average level of extroversion is well-suited for a clerical role, as it suggests a preference for independent work, focus on tasks, and minimal need for social interaction. This aligns with the job’s structured and detail-oriented nature, making the candidate a good fit.",
      Average:
        "A low to average level of extroversion is well-suited for a clerical role, as it suggests a preference for independent work, focus on tasks, and minimal need for social interaction. This aligns with the job’s structured and detail-oriented nature, making the candidate a good fit.",
      High: "A high level of extroversion may not be ideal for a clerical role, as the position typically requires focused, independent work rather than frequent social engagement. The candidate’s preference for interaction and dynamic environments may not align with the job’s structured and task-driven nature.",
      Extremely_High:
        "A high level of extroversion may not be ideal for a clerical role, as the position typically requires focused, independent work rather than frequent social engagement. The candidate’s preference for interaction and dynamic environments may not align with the job’s structured and task-driven nature.",
    },
    Conscientiousness: {
      Extremely_Low:
        "A lower level of conscientiousness may not be suitable for a clerical role, as the position requires meticulous record-keeping, time management, and consistency. A lack of structure and attention to detail could result in errors and inefficiencies in administrative processes.",
      Low: "A lower level of conscientiousness may not be suitable for a clerical role, as the position requires meticulous record-keeping, time management, and consistency. A lack of structure and attention to detail could result in errors and inefficiencies in administrative processes.",
      Average:
        "A lower level of conscientiousness may not be suitable for a clerical role, as the position requires meticulous record-keeping, time management, and consistency. A lack of structure and attention to detail could result in errors and inefficiencies in administrative processes.",
      High: "For clerical positions, a high level of conscientiousness is beneficial as the role requires precision, reliability, and adherence to structured processes. Strong organizational skills and diligence contribute to maintaining accuracy in documentation and administrative tasks.",
      Extremely_High:
        "For clerical positions, a high level of conscientiousness is beneficial as the role requires precision, reliability, and adherence to structured processes. Strong organizational skills and diligence contribute to maintaining accuracy in documentation and administrative tasks.",
    },
    Openness: {
      Extremely_Low:
        "A lower level of openness is suitable for clerical roles, as these positions often involve structured tasks, adherence to routine procedures, and efficiency in handling administrative responsibilities. Stability and familiarity with established workflows contribute to productivity.",
      Low: "A lower level of openness is suitable for clerical roles, as these positions often involve structured tasks, adherence to routine procedures, and efficiency in handling administrative responsibilities. Stability and familiarity with established workflows contribute to productivity.",
      Average:
        "A lower level of openness is suitable for clerical roles, as these positions often involve structured tasks, adherence to routine procedures, and efficiency in handling administrative responsibilities. Stability and familiarity with established workflows contribute to productivity.",
      High: "While high openness is not a key requirement for clerical work, it is not entirely incompatible. However, a strong inclination toward change and unconventional approaches may not align well with the structured and process-driven nature of the role.",
      Extremely_High:
        "While high openness is not a key requirement for clerical work, it is not entirely incompatible. However, a strong inclination toward change and unconventional approaches may not align well with the structured and process-driven nature of the role.",
    },
    Agreeableness: {
      Extremely_Low:
        "Lower levels of agreeableness may result in difficulties with teamwork, reduced willingness to accommodate procedural changes, or potential conflicts in a structured work environment. Given the collaborative nature of clerical tasks, a more agreeable disposition is preferred.",
      Low: "Lower levels of agreeableness may result in difficulties with teamwork, reduced willingness to accommodate procedural changes, or potential conflicts in a structured work environment. Given the collaborative nature of clerical tasks, a more agreeable disposition is preferred.",
      Average:
        "Lower levels of agreeableness may result in difficulties with teamwork, reduced willingness to accommodate procedural changes, or potential conflicts in a structured work environment. Given the collaborative nature of clerical tasks, a more agreeable disposition is preferred.",
      High: "A high level of agreeableness is beneficial in clerical roles, where cooperation, responsiveness, and maintaining positive professional relationships are essential. A collaborative and accommodating nature supports workplace harmony and efficiency in administrative functions.",
      Extremely_High:
        "A high level of agreeableness is beneficial in clerical roles, where cooperation, responsiveness, and maintaining positive professional relationships are essential. A collaborative and accommodating nature supports workplace harmony and efficiency in administrative functions.",
    },
    Emotional_Stability: {
      Extremely_Low:
        "Lower emotional stability may contribute to stress, difficulty managing workload fluctuations, or reduced focus on structured tasks. Since clerical work benefits from steadiness and reliability, higher emotional stability is preferable.",
      Low: "Lower emotional stability may contribute to stress, difficulty managing workload fluctuations, or reduced focus on structured tasks. Since clerical work benefits from steadiness and reliability, higher emotional stability is preferable.",
      Average:
        "Lower emotional stability may contribute to stress, difficulty managing workload fluctuations, or reduced focus on structured tasks. Since clerical work benefits from steadiness and reliability, higher emotional stability is preferable.",
      High: "Emotional stability supports consistency, patience, and efficiency in clerical roles. A composed and resilient approach ensures smooth handling of routine tasks, procedural responsibilities, and administrative challenges.",
      Extremely_High:
        "Emotional stability supports consistency, patience, and efficiency in clerical roles. A composed and resilient approach ensures smooth handling of routine tasks, procedural responsibilities, and administrative challenges.",
    },
    Communication_Skills: {
      Extremely_Low:
        "Clerical roles involve interacting with colleagues, following instructions, and maintaining accuracy in documentation. Weak communication skills may result in misunderstandings, errors in task execution, and difficulties in coordinating with others, making this range unsuitable for the role.",
      Low: "A moderate level of communication ability is sufficient for clerical roles, allowing for clear understanding of instructions and smooth coordination in routine tasks. While advanced communication skills are not necessary, this range supports efficiency in clerical work.",
      Average:
        "A moderate level of communication ability is sufficient for clerical roles, allowing for clear understanding of instructions and smooth coordination in routine tasks. While advanced communication skills are not necessary, this range supports efficiency in clerical work.",
      High: "A moderate level of communication ability is sufficient for clerical roles, allowing for clear understanding of instructions and smooth coordination in routine tasks. While advanced communication skills are not necessary, this range supports efficiency in clerical work.",
      Extremely_High:
        "Although high-level communication skills are not a strict requirement for clerical roles, individuals with strong communication abilities may excel in tasks involving documentation, reporting, and coordination. ",
    },
    Critical_Thinking: {
      Extremely_Low:
        "While clerical roles primarily involve structured and repetitive tasks, some level of critical thinking is necessary for accuracy and problem-solving. A limited ability to evaluate information, recognize patterns, and adapt to minor challenges may result in inefficiencies, which may be unsuitable for this role.",
      Low: "While clerical roles primarily involve structured and repetitive tasks, some level of critical thinking is necessary for accuracy and problem-solving. A limited ability to evaluate information, recognize patterns, and adapt to minor challenges may result in inefficiencies, which may be unsuitable for this role.",
      Average:
        "A moderate level of critical thinking allows for effective task management, problem-solving, and attention to detail in clerical work. While highly advanced critical thinking is not essential, a balanced approach supports efficiency and accuracy in administrative tasks.",
      High: "A moderate level of critical thinking allows for effective task management, problem-solving, and attention to detail in clerical work. While highly advanced critical thinking is not essential, a balanced approach supports efficiency and accuracy in administrative tasks.",
      Extremely_High:
        "A moderate level of critical thinking allows for effective task management, problem-solving, and attention to detail in clerical work. While highly advanced critical thinking is not essential, a balanced approach supports efficiency and accuracy in administrative tasks.",
    },
    Leadership_Ability: {
      Extremely_Low:
        "Clerical roles emphasize accuracy, organization, and structured work rather than leadership responsibilities. Thus, Strong leadership is not a primary requirement for this role.",
      Low: "Clerical roles emphasize accuracy, organization, and structured work rather than leadership responsibilities. Thus, Strong leadership is not a primary requirement for this role.",
      Average:
        "Clerical roles emphasize accuracy, organization, and structured work rather than leadership responsibilities. Thus, Strong leadership is not a primary requirement for this role.",
      High: "While leadership skills are not necessary, they can contribute to better workflow coordination, efficiency, and professional growth, which is suitable for this role. ",
      Extremely_High:
        "While leadership skills are not necessary, they can contribute to better workflow coordination, efficiency, and professional growth, which is suitable for this role. ",
    },
    Professional_Culture_Profile: {
      Extremely_Low:
        " Indicates a preference for structured, routine tasks over collaborative and adaptive work settings, which may limit effectiveness in clerical roles requiring team coordination.",
      Low: "The candidate might find it challenging to adapt to frequently changing office dynamics or collaborative tasks typical in clerical work.",
      Average:
        "Reflects a good fit for clerical roles that balance routine tasks with occasional team interactions and adaptability to new office procedures.",
      High: " Shows a strong capability to adapt and work collaboratively, enhancing the candidate's effectiveness in clerical positions that require frequent interaction and teamwork.",
      Extremely_High:
        "The candidate is exceptionally well-suited for clerical roles that involve significant teamwork, continuous learning, and adaptation to new technologies or processes.",
    },
    
  },
  BA: {
    Extroversion: {
      Extremely_Low:
        "A low to average level of extroversion may not be ideal for a business analyst, as the role demands proactive interaction, persuasive communication, and adaptability in dynamic business environments. Limited social engagement could hinder collaboration and the ability to influence key stakeholders effectively.",
      Low: "A low to average level of extroversion may not be ideal for a business analyst, as the role demands proactive interaction, persuasive communication, and adaptability in dynamic business environments. Limited social engagement could hinder collaboration and the ability to influence key stakeholders effectively.",
      Average:
        "A low to average level of extroversion may not be ideal for a business analyst, as the role demands proactive interaction, persuasive communication, and adaptability in dynamic business environments. Limited social engagement could hinder collaboration and the ability to influence key stakeholders effectively.",
      High: "A high level of extroversion is advantageous for a business analyst, as the role requires frequent collaboration, stakeholder engagement, and effective communication. Strong interpersonal skills and confidence in discussions contribute to gathering insights and driving strategic decisions.",
      Extremely_High:
        "A high level of extroversion is advantageous for a business analyst, as the role requires frequent collaboration, stakeholder engagement, and effective communication. Strong interpersonal skills and confidence in discussions contribute to gathering insights and driving strategic decisions.",
    },
    Conscientiousness: {
      Extremely_Low:
        "A lower level of conscientiousness may not be ideal for a business analyst, as the role requires methodical evaluation, structured data interpretation, and strategic planning. Difficulty in maintaining organization and follow-through could impact the accuracy of business insights and recommendations.",
      Low: "A lower level of conscientiousness may not be ideal for a business analyst, as the role requires methodical evaluation, structured data interpretation, and strategic planning. Difficulty in maintaining organization and follow-through could impact the accuracy of business insights and recommendations.",
      Average:
        "A lower level of conscientiousness may not be ideal for a business analyst, as the role requires methodical evaluation, structured data interpretation, and strategic planning. Difficulty in maintaining organization and follow-through could impact the accuracy of business insights and recommendations.",
      High: "For a business analyst, high conscientiousness supports structured analysis, strategic decision-making, and meticulous attention to detail. Strong organizational skills contribute to clear documentation, stakeholder communication, and effective problem-solving.",
      Extremely_High:
        "For a business analyst, high conscientiousness supports structured analysis, strategic decision-making, and meticulous attention to detail. Strong organizational skills contribute to clear documentation, stakeholder communication, and effective problem-solving.",
    },
    Openness: {
      Extremely_Low:
        "A lower level of openness may restrict the ability to analyze problems creatively or adapt to evolving business environments. Given the analytical and strategic nature of this role, limited openness is not well-aligned with its demands.",
      Low: "A lower level of openness may restrict the ability to analyze problems creatively or adapt to evolving business environments. Given the analytical and strategic nature of this role, limited openness is not well-aligned with its demands.",
      Average:
        "A lower level of openness may restrict the ability to analyze problems creatively or adapt to evolving business environments. Given the analytical and strategic nature of this role, limited openness is not well-aligned with its demands.",
      High: "A business analyst benefits from high level of openness, which fosters curiosity, adaptability, and the ability to assess complex scenarios from multiple perspectives. This enhances problem-solving, data interpretation, and innovative strategic planning.",
      Extremely_High:
        "A business analyst benefits from high level of openness, which fosters curiosity, adaptability, and the ability to assess complex scenarios from multiple perspectives. This enhances problem-solving, data interpretation, and innovative strategic planning.",
    },
    Agreeableness: {
      Extremely_Low:
        "Lower agreeableness may result in difficulties in building stakeholder trust, negotiating solutions, or effectively collaborating across teams. As the role requires balancing various perspectives, a higher level of agreeableness is preferred for success.",
      Low: "Lower agreeableness may result in difficulties in building stakeholder trust, negotiating solutions, or effectively collaborating across teams. As the role requires balancing various perspectives, a higher level of agreeableness is preferred for success.",
      Average:
        "Lower agreeableness may result in difficulties in building stakeholder trust, negotiating solutions, or effectively collaborating across teams. As the role requires balancing various perspectives, a higher level of agreeableness is preferred for success.",
      High: "A high level of agreeableness supports the role of a business analyst by fostering strong interpersonal relationships, effective stakeholder communication, and constructive problem resolution. Diplomacy and collaboration are essential for aligning business goals with analytical insights.",
      Extremely_High:
        "A high level of agreeableness supports the role of a business analyst by fostering strong interpersonal relationships, effective stakeholder communication, and constructive problem resolution. Diplomacy and collaboration are essential for aligning business goals with analytical insights.",
    },
    Emotional_Stability: {
      Extremely_Low:
        "Lower emotional stability may hinder effective decision-making, create difficulties in managing high-stakes discussions, or reduce adaptability in evolving business environments. To ensure reliability and strategic problem-solving, higher emotional stability is preferred.",
      Low: "Lower emotional stability may hinder effective decision-making, create difficulties in managing high-stakes discussions, or reduce adaptability in evolving business environments. To ensure reliability and strategic problem-solving, higher emotional stability is preferred.",
      Average:
        "Lower emotional stability may hinder effective decision-making, create difficulties in managing high-stakes discussions, or reduce adaptability in evolving business environments. To ensure reliability and strategic problem-solving, higher emotional stability is preferred.",
      High: "Business analysts benefit from emotional stability as it enables clear decision-making, constructive negotiation, and professional communication under high-pressure situations. A composed mindset enhances stakeholder interactions and problem resolution.",
      Extremely_High:
        "Business analysts benefit from emotional stability as it enables clear decision-making, constructive negotiation, and professional communication under high-pressure situations. A composed mindset enhances stakeholder interactions and problem resolution.",
    },
    Communication_Skills: {
      Extremely_Low:
        "A business analyst must gather and document requirements, engage with stakeholders, and facilitate discussions. Insufficient communication skills may impact the ability to extract relevant information, explain findings clearly, and build professional relationships, which is unsuitable for the role.",
      Low: "This level of communication skill allows for structured interactions, enabling a business analyst to document requirements and engage in discussions effectively. However, stronger skills in negotiation and persuasion would improve the ability to influence decision-making and lead stakeholder interactions more efficiently.",
      Average:
        "This level of communication skill allows for structured interactions, enabling a business analyst to document requirements and engage in discussions effectively. However, stronger skills in negotiation and persuasion would improve the ability to influence decision-making and lead stakeholder interactions more efficiently.",
      High: "This level of communication skill allows for structured interactions, enabling a business analyst to document requirements and engage in discussions effectively. However, stronger skills in negotiation and persuasion would improve the ability to influence decision-making and lead stakeholder interactions more efficiently.",
      Extremely_High:
        "A business analyst with strong communication skills excels in engaging with stakeholders, presenting findings clearly, and ensuring smooth collaboration between teams. This level of communication ability is crucial for success in the role, making it highly suitable.",
    },
    Critical_Thinking: {
      Extremely_Low:
        "Business analysts must interpret data, assess trends, and provide insights to improve decision-making. Limited critical thinking skills can affect the ability to evaluate business needs, propose innovative solutions, and anticipate potential risks, which is unsuitable for the role.",
      Low: "Business analysts must interpret data, assess trends, and provide insights to improve decision-making. Limited critical thinking skills can affect the ability to evaluate business needs, propose innovative solutions, and anticipate potential risks, which is unsuitable for the role.",
      Average:
        "The ability to analyze data effectively, identify patterns, and present well-reasoned recommendations is essential for a business analyst. Strong critical thinking supports logical decision-making and enhances problem-solving capabilities, which is highly suitable for the role.",
      High: "The ability to analyze data effectively, identify patterns, and present well-reasoned recommendations is essential for a business analyst. Strong critical thinking supports logical decision-making and enhances problem-solving capabilities, which is highly suitable for the role.",
      Extremely_High:
        "The ability to analyze data effectively, identify patterns, and present well-reasoned recommendations is essential for a business analyst. Strong critical thinking supports logical decision-making and enhances problem-solving capabilities, which is highly suitable for the role.",
    },
    Leadership_Ability: {
      Extremely_Low:
        "A business analyst needs to influence stakeholders, drive discussions, and facilitate decision-making processes. Weak leadership ability may lead to difficulties in managing collaborative efforts and guiding teams toward strategic insights, which is not ideal for the role.",
      Low: "A business analyst needs to influence stakeholders, drive discussions, and facilitate decision-making processes. Weak leadership ability may lead to difficulties in managing collaborative efforts and guiding teams toward strategic insights, which is not ideal for the role.",
      Average:
        "A business analyst needs to influence stakeholders, drive discussions, and facilitate decision-making processes. Weak leadership ability may lead to difficulties in managing collaborative efforts and guiding teams toward strategic insights, which is not ideal for the role.",
      High: "Strong leadership skills allow a business analyst to effectively communicate ideas, build consensus, and lead data-driven initiatives. The ability to guide teams and stakeholders toward well-informed decisions is highly beneficial for success in the role.",
      Extremely_High:
        "Strong leadership skills allow a business analyst to effectively communicate ideas, build consensus, and lead data-driven initiatives. The ability to guide teams and stakeholders toward well-informed decisions is highly beneficial for success in the role.",
    },
    Professional_Culture_Profile: {
      Extremely_Low:
        "The candidate exhibits limited alignment with the dynamic and collaborative nature of a business analyst role, which could hinder their ability to adapt to changing business requirements and effectively gather diverse stakeholder inputs.",
      Low: "The candidate might face challenges in fully engaging with the iterative and team-oriented processes typical for a business analyst, potentially impacting their effectiveness in roles requiring high adaptability and collaborative problem-solving.",
      Average:
        "This level suggests a balanced capability for adapting to new business practices and working collaboratively, making the candidate a solid fit for a business analyst role that values both independence and teamwork.",
      High: "The candidate's strong adaptability and collaborative skills align well with the demands of a business analyst, likely enhancing their ability to manage stakeholder relationships and contribute to team-oriented business solutions.",
      Extremely_High:
        "Reflecting exceptional adaptability and teamwork, the candidate is likely to excel in a business analyst role, driving innovation and improvements in business processes and stakeholder management.",
    },
  },
  QA: {
    Extroversion: {
      Extremely_Low:
        "A low to average level of extroversion is well-suited for a quality analyst role, as it aligns with the need for focused, detail-oriented work. The ability to work independently with minimal social interaction supports accuracy, precision, and thorough analysis, making the candidate a strong fit.",
      Low: "A low to average level of extroversion is well-suited for a quality analyst role, as it aligns with the need for focused, detail-oriented work. The ability to work independently with minimal social interaction supports accuracy, precision, and thorough analysis, making the candidate a strong fit.",
      Average:
        "A low to average level of extroversion is well-suited for a quality analyst role, as it aligns with the need for focused, detail-oriented work. The ability to work independently with minimal social interaction supports accuracy, precision, and thorough analysis, making the candidate a strong fit.",
      High: "A high level of extroversion may not be ideal for a quality analyst role, as the position requires concentration, attention to detail, and independent problem-solving. A preference for social interaction and dynamic environments may divert focus from the meticulous and structured nature of the job.",
      Extremely_High:
        "A high level of extroversion may not be ideal for a quality analyst role, as the position requires concentration, attention to detail, and independent problem-solving. A preference for social interaction and dynamic environments may divert focus from the meticulous and structured nature of the job.",
    },
    Conscientiousness: {
      Extremely_Low:
        "A lower level of conscientiousness may not align well with the role of a quality analyst, where structured evaluation and adherence to quality benchmarks are critical. A lack of attention to detail and discipline could compromise the accuracy of assessments and overall quality control.",
      Low: "A lower level of conscientiousness may not align well with the role of a quality analyst, where structured evaluation and adherence to quality benchmarks are critical. A lack of attention to detail and discipline could compromise the accuracy of assessments and overall quality control.",
      Average:
        "A lower level of conscientiousness may not align well with the role of a quality analyst, where structured evaluation and adherence to quality benchmarks are critical. A lack of attention to detail and discipline could compromise the accuracy of assessments and overall quality control.",
      High: "A high level of conscientiousness is essential for a quality analyst, as the role demands meticulous attention to detail, strong analytical skills, and adherence to quality standards. Precision and consistency are key to ensuring product or process efficiency.",
      Extremely_High:
        "A high level of conscientiousness is essential for a quality analyst, as the role demands meticulous attention to detail, strong analytical skills, and adherence to quality standards. Precision and consistency are key to ensuring product or process efficiency.",
    },
    Openness: {
      Extremely_Low:
        "Quality analyst roles benefit from a lower level of openness, as consistency, adherence to strict quality standards, and methodical evaluations are crucial. A structured approach ensures accuracy and compliance with predefined metrics.",
      Low: "Quality analyst roles benefit from a lower level of openness, as consistency, adherence to strict quality standards, and methodical evaluations are crucial. A structured approach ensures accuracy and compliance with predefined metrics.",
      Average:
        "Quality analyst roles benefit from a lower level of openness, as consistency, adherence to strict quality standards, and methodical evaluations are crucial. A structured approach ensures accuracy and compliance with predefined metrics.",
      High: "While high openness is not typically required, it is not entirely unsuitable. Some level of creativity can support problem-solving in quality assessments, but an excessive focus on novelty may be less compatible with the role’s structured nature.",
      Extremely_High:
        "While high openness is not typically required, it is not entirely unsuitable. Some level of creativity can support problem-solving in quality assessments, but an excessive focus on novelty may be less compatible with the role’s structured nature.",
    },
    Agreeableness: {
      Extremely_Low:
        "Lower agreeableness may lead to resistance in collaborative problem-solving or difficulties in maintaining positive interactions with peers. Given that quality analysis often requires cooperation and alignment with team standards, a higher level of agreeableness is more suitable.",
      Low: "Lower agreeableness may lead to resistance in collaborative problem-solving or difficulties in maintaining positive interactions with peers. Given that quality analysis often requires cooperation and alignment with team standards, a higher level of agreeableness is more suitable.",
      Average:
        "Lower agreeableness may lead to resistance in collaborative problem-solving or difficulties in maintaining positive interactions with peers. Given that quality analysis often requires cooperation and alignment with team standards, a higher level of agreeableness is more suitable.",
      High: "A high level of agreeableness enhances a quality analyst’s ability to work collaboratively, provide constructive feedback, and ensure quality standards are met without unnecessary friction. Effective communication and teamwork contribute to smoother processes and compliance with regulations.",
      Extremely_High:
        "A high level of agreeableness enhances a quality analyst’s ability to work collaboratively, provide constructive feedback, and ensure quality standards are met without unnecessary friction. Effective communication and teamwork contribute to smoother processes and compliance with regulations.",
    },
    Emotional_Stability: {
      Extremely_Low:
        "A lower level of emotional stability may affect the ability to remain composed when dealing with setbacks, criticism, or quality discrepancies. To ensure consistent performance and analytical precision, higher emotional stability is preferred.",
      Low: "A lower level of emotional stability may affect the ability to remain composed when dealing with setbacks, criticism, or quality discrepancies. To ensure consistent performance and analytical precision, higher emotional stability is preferred.",
      Average:
        "A lower level of emotional stability may affect the ability to remain composed when dealing with setbacks, criticism, or quality discrepancies. To ensure consistent performance and analytical precision, higher emotional stability is preferred.",
      High: "Quality analysts require emotional stability to maintain objectivity, handle feedback constructively, and approach problem-solving with a level-headed mindset. A calm and collected approach supports accuracy and thorough evaluation.",
      Extremely_High:
        "Quality analysts require emotional stability to maintain objectivity, handle feedback constructively, and approach problem-solving with a level-headed mindset. A calm and collected approach supports accuracy and thorough evaluation.",
    },
    Communication_Skills: {
      Extremely_Low:
        "A quality analyst needs to document findings, communicate errors, and collaborate with teams to ensure product quality. Poor communication skills may hinder the ability to provide clear feedback and discuss improvements, which is unsuitable for the role.",
      Low: "A moderate level of communication skills allows for effective reporting, documentation, and coordination with teams. These characteristics are sufficient for a quality analyst, enabling them to convey findings accurately and contribute to quality control processes.",
      Average:
        "A moderate level of communication skills allows for effective reporting, documentation, and coordination with teams. These characteristics are sufficient for a quality analyst, enabling them to convey findings accurately and contribute to quality control processes.",
      High: "A moderate level of communication skills allows for effective reporting, documentation, and coordination with teams. These characteristics are sufficient for a quality analyst, enabling them to convey findings accurately and contribute to quality control processes.",
      Extremely_High:
        "While strong communication skills are not mandatory for this role, they can enhance a quality analyst’s ability to provide detailed reports, communicate with stakeholders, and influence process improvements. This is beneficial but not essential for success in the position.",
    },
    Critical_Thinking: {
      Extremely_Low:
        "A quality analyst must assess product functionality, identify defects, and recommend improvements. Weak critical thinking skills can affect the ability to analyze data, recognize inconsistencies, and ensure product quality, which is unsuitable for the role.",
      Low: "A quality analyst must assess product functionality, identify defects, and recommend improvements. Weak critical thinking skills can affect the ability to analyze data, recognize inconsistencies, and ensure product quality, which is unsuitable for the role.",
      Average:
        "The ability to evaluate quality standards, detect issues, and implement corrective measures is essential for a quality analyst. Strong critical thinking supports effective problem identification and resolution, which is highly suitable for success in the role.",
      High: "The ability to evaluate quality standards, detect issues, and implement corrective measures is essential for a quality analyst. Strong critical thinking supports effective problem identification and resolution, which is highly suitable for success in the role.",
      Extremely_High:
        "The ability to evaluate quality standards, detect issues, and implement corrective measures is essential for a quality analyst. Strong critical thinking supports effective problem identification and resolution, which is highly suitable for success in the role.",
    },
    Leadership_Ability: {
      Extremely_Low:
        "A quality analyst focuses on evaluating standards, identifying issues, and ensuring compliance rather than leading teams. Thus, having leadership skills is not a primary requirement for the role.",
      Low: "A quality analyst focuses on evaluating standards, identifying issues, and ensuring compliance rather than leading teams. Thus, having leadership skills is not a primary requirement for the role.",
      Average:
        "A quality analyst focuses on evaluating standards, identifying issues, and ensuring compliance rather than leading teams. Thus, having leadership skills is not a primary requirement for the role.",
      High: "While leadership ability is not a necessity, it can enhance collaboration with teams and stakeholders, improving overall quality assurance processes. Therefore, these characteristics are advantageous but not mandatory for success in the role.",
      Extremely_High:
        "While leadership ability is not a necessity, it can enhance collaboration with teams and stakeholders, improving overall quality assurance processes. Therefore, these characteristics are advantageous but not mandatory for success in the role.",
    },
    Professional_Culture_Profile: {
      Extremely_Low:
        " Indicates potential difficulties in adapting to new testing paradigms or working collaboratively within QA teams, which could hinder effectiveness in roles requiring frequent updates to testing procedures.",
      Low: "May face challenges in dynamic testing environments that require frequent collaboration with developers and other stakeholders.",
      Average:
        "Suitable for QA roles that balance independent testing tasks with team-based projects, indicating the candidate can adapt to standard QA processes.",
      High: "Excellent for QA positions that require strong collaborative skills to work effectively with cross-functional teams in developing and refining quality standards.",
      Extremely_High:
        "Exceptionally well-suited for senior QA roles or roles that require leading QA teams, thanks to outstanding adaptability and teamwork capabilities, likely enhancing process improvements and team efficiency.",
    },
  },
  Dev: {
    Extroversion: {
      Extremely_Low:
        "A low to average level of extroversion is beneficial for a developer role, as it supports deep focus, independent problem-solving, and sustained attention to complex coding tasks. The ability to work with minimal social distractions enhances efficiency in technical execution.",
      Low: "A low to average level of extroversion is beneficial for a developer role, as it supports deep focus, independent problem-solving, and sustained attention to complex coding tasks. The ability to work with minimal social distractions enhances efficiency in technical execution.",
      Average:
        "A low to average level of extroversion is beneficial for a developer role, as it supports deep focus, independent problem-solving, and sustained attention to complex coding tasks. The ability to work with minimal social distractions enhances efficiency in technical execution.",
      High: "A high level of extroversion may not be ideal for a developer role, as the job often requires extended periods of concentrated work. A strong preference for social engagement could interfere with the structured, detail-oriented nature of coding and problem-solving.",
      Extremely_High:
        "A high level of extroversion may not be ideal for a developer role, as the job often requires extended periods of concentrated work. A strong preference for social engagement could interfere with the structured, detail-oriented nature of coding and problem-solving.",
    },
    Conscientiousness: {
      Extremely_Low:
        "A lower level of conscientiousness may not be ideal for a developer, as the role requires structured thinking, precision, and commitment to continuous improvement. Lack of organization and discipline could result in inconsistent code quality and project delays.",
      Low: "A lower level of conscientiousness may not be ideal for a developer, as the role requires structured thinking, precision, and commitment to continuous improvement. Lack of organization and discipline could result in inconsistent code quality and project delays.",
      Average:
        "A lower level of conscientiousness may not be ideal for a developer, as the role requires structured thinking, precision, and commitment to continuous improvement. Lack of organization and discipline could result in inconsistent code quality and project delays.",
      High: "High conscientiousness is valuable for a developer, ensuring systematic problem-solving, thorough coding practices, and adherence to project deadlines. Strong discipline and organization enhance efficiency and the ability to produce reliable, maintainable software.",
      Extremely_High:
        "High conscientiousness is valuable for a developer, ensuring systematic problem-solving, thorough coding practices, and adherence to project deadlines. Strong discipline and organization enhance efficiency and the ability to produce reliable, maintainable software.",
    },
    Openness: {
      Extremely_Low:
        "A lower level of openness is beneficial for developers who rely on structured problem-solving, adherence to coding standards, and methodical execution. Familiarity with best practices and a preference for systematic thinking contribute to efficiency in development tasks.",
      Low: "A lower level of openness is beneficial for developers who rely on structured problem-solving, adherence to coding standards, and methodical execution. Familiarity with best practices and a preference for systematic thinking contribute to efficiency in development tasks.",
      Average:
        "A lower level of openness is beneficial for developers who rely on structured problem-solving, adherence to coding standards, and methodical execution. Familiarity with best practices and a preference for systematic thinking contribute to efficiency in development tasks.",
      High: "While not a strict requirement, high openness is not entirely incompatible with development roles. Creativity can be valuable in problem-solving and innovation, but an excessive focus on unconventional approaches may impact consistency in coding practices and project execution.",
      Extremely_High:
        "While not a strict requirement, high openness is not entirely incompatible with development roles. Creativity can be valuable in problem-solving and innovation, but an excessive focus on unconventional approaches may impact consistency in coding practices and project execution.",
    },
    Agreeableness: {
      Extremely_Low:
        "Lower levels of agreeableness may hinder effective teamwork, making it challenging to coordinate tasks and resolve coding challenges collaboratively. Given the team-oriented nature of development roles, a higher level of agreeableness is more advantageous.",
      Low: "Lower levels of agreeableness may hinder effective teamwork, making it challenging to coordinate tasks and resolve coding challenges collaboratively. Given the team-oriented nature of development roles, a higher level of agreeableness is more advantageous.",
      Average:
        "Lower levels of agreeableness may hinder effective teamwork, making it challenging to coordinate tasks and resolve coding challenges collaboratively. Given the team-oriented nature of development roles, a higher level of agreeableness is more advantageous.",
      High: "Developers benefit from a high level of agreeableness, as teamwork, adaptability, and open communication are crucial in software development environments. A cooperative approach facilitates smooth collaboration with designers, testers, and other team members.",
      Extremely_High:
        "Developers benefit from a high level of agreeableness, as teamwork, adaptability, and open communication are crucial in software development environments. A cooperative approach facilitates smooth collaboration with designers, testers, and other team members.",
    },
    Emotional_Stability: {
      Extremely_Low:
        "Lower emotional stability may result in difficulty handling setbacks, frustration with complex coding challenges, or struggles in adapting to changing project requirements. Emotional resilience is strongly preferred to maintain efficiency in development tasks.",
      Low: "Lower emotional stability may result in difficulty handling setbacks, frustration with complex coding challenges, or struggles in adapting to changing project requirements. Emotional resilience is strongly preferred to maintain efficiency in development tasks.",
      Average:
        "Lower emotional stability may result in difficulty handling setbacks, frustration with complex coding challenges, or struggles in adapting to changing project requirements. Emotional resilience is strongly preferred to maintain efficiency in development tasks.",
      High: "A high level of emotional stability is valuable in a development role, as it supports problem-solving, patience with debugging, and effective collaboration under tight deadlines. The ability to manage frustration and focus on solutions is crucial in programming environments.",
      Extremely_High:
        "A high level of emotional stability is valuable in a development role, as it supports problem-solving, patience with debugging, and effective collaboration under tight deadlines. The ability to manage frustration and focus on solutions is crucial in programming environments.",
    },
    Communication_Skills: {
      Extremely_Low:
        "Developers must interact with teams, understand project requirements, and explain technical concepts when necessary. Poor communication skills can lead to misunderstandings, ineffective collaboration, and difficulty in conveying ideas, which is unsuitable for the role.",
      Low: "A developer with moderate communication skills can function well in a structured team setting, interpret technical instructions, and engage in discussions when necessary. This allows for satisfactory performance, stronger communication skills would enhance the ability to collaborate effectively and contribute to problem-solving efforts.",
      Average:
        "A developer with moderate communication skills can function well in a structured team setting, interpret technical instructions, and engage in discussions when necessary. This allows for satisfactory performance, stronger communication skills would enhance the ability to collaborate effectively and contribute to problem-solving efforts.",
      High: "A developer with moderate communication skills can function well in a structured team setting, interpret technical instructions, and engage in discussions when necessary. This allows for satisfactory performance, stronger communication skills would enhance the ability to collaborate effectively and contribute to problem-solving efforts.",
      Extremely_High:
        "Developers who possess strong communication skills can effectively articulate technical concepts, work seamlessly with cross-functional teams, and contribute meaningfully to discussions. These characteristics support efficient teamwork and knowledge-sharing which is ideal for the role.",
    },
    Critical_Thinking: {
      Extremely_Low:
        "A developer needs to analyze problems, debug code, and create efficient solutions. Insufficient critical thinking ability may lead to difficulties in troubleshooting, optimizing systems, and understanding complex logic, which is unsuitable for the role.",
      Low: "A developer needs to analyze problems, debug code, and create efficient solutions. Insufficient critical thinking ability may lead to difficulties in troubleshooting, optimizing systems, and understanding complex logic, which is unsuitable for the role.",
      Average:
        "Strong critical thinking skills enhance a developer’s ability to solve complex coding challenges, anticipate issues in software architecture, and optimize solutions. This supports analytical problem-solving and adaptability, making it highly beneficial for success in the role.",
      High: "Strong critical thinking skills enhance a developer’s ability to solve complex coding challenges, anticipate issues in software architecture, and optimize solutions. This supports analytical problem-solving and adaptability, making it highly beneficial for success in the role.",
      Extremely_High:
        "Strong critical thinking skills enhance a developer’s ability to solve complex coding challenges, anticipate issues in software architecture, and optimize solutions. This supports analytical problem-solving and adaptability, making it highly beneficial for success in the role.",
    },
    Leadership_Ability: {
      Extremely_Low:
        "A developer’s role primarily focuses on individual problem-solving and technical execution rather than team leadership. While leadership can be beneficial in collaborative projects, it is not a primary requirement for the role.",
      Low: "A developer’s role primarily focuses on individual problem-solving and technical execution rather than team leadership. While leadership can be beneficial in collaborative projects, it is not a primary requirement for the role.",
      Average:
        "A developer’s role primarily focuses on individual problem-solving and technical execution rather than team leadership. While leadership can be beneficial in collaborative projects, it is not a primary requirement for the role.",
      High: "While not a core requirement, strong leadership ability can be an asset for developers in team-based environments, helping with mentorship, project coordination, and innovation. These characteristics may enhance professional growth but are not mandatory for success in this role ",
      Extremely_High:
        "While not a core requirement, strong leadership ability can be an asset for developers in team-based environments, helping with mentorship, project coordination, and innovation. These characteristics may enhance professional growth but are not mandatory for success in this role ",
    },
    Professional_Culture_Profile: {
      Extremely_Low:
        "May indicate challenges in adapting to new programming paradigms or working in team-based development environments, potentially limiting effectiveness in collaborative coding projects.",
      Low: "Could struggle with the dynamic and collaborative nature of modern development teams, particularly in agile environments.",
      Average:
        "Adequate for roles that require a mix of independent coding tasks and collaborative development projects, suggesting the candidate can manage typical team interactions.",
      High: "Well-suited for development roles that require frequent collaboration with other developers, testers, and project managers, enhancing team synergy and project success.",
      Extremely_High:
        " Ideal for leadership roles in development teams, where high adaptability and excellent collaborative skills are critical for managing complex projects and diverse teams.",
    },
  },
};
function generateJobSpecificReport(jobRole, scores) {
  const jobFeedback = jobRoleFeedback[jobRole];  // Assuming 'jobRole' is 'PM' or 'Clerical'
  const reportSummary = {};

  for (const trait in scores) {
      const score = scores[trait];
      const rangeLabel = getRangeLabel(score, trait);
      const feedback = jobFeedback[trait][rangeLabel];
      
      // Combine the general trait description with job-specific feedback
      reportSummary[trait] = ` ${feedback}`;
  }
  return reportSummary;
}




/**
 * Calculate candidate scores for each trait based on answers stored in localStorage.
 * @returns {Object} scores - Mapped scores per trait.
 */


function calculateScores() {
  const answers = JSON.parse(localStorage.getItem("assessmentAnswers")) || {};
  const scores = {};

  for (const trait in traitMapping) {
    scores[trait] = traitMapping[trait].reduce(
      (sum, qNum) => sum + (answers[`q${qNum}`] || 0),
      0
    );
  }

  return scores;
}


/**
 * Determine score range label (Extremely Low, Low, Average, etc.) for a given trait.
 * @param {number} score - Candidate's total score for the trait.
 * @param {string} trait - The trait being evaluated.
 * @returns {string} rangeLabel - The classification of the score.
 */

function getRangeLabel(score, trait) {
  const [EL, L, A, H, EH] = ranges[trait];
  if (score >= EL[0] && score <= EL[1]) return "Extremely_Low";
  if (score >= L[0] && score <= L[1]) return "Low";
  if (score >= A[0] && score <= A[1]) return "Average";
  if (score >= H[0] && score <= H[1]) return "High";
  if (score >= EH[0] && score <= EH[1]) return "Extremely_High";
  return "Unknown";
}


/**
 * Generate candidate's report based on trait scores and ranges.
 */

async function generateReport() {
  const scores = calculateScores();
  console.log(scores);
  
  const jobselected = JSON.parse(localStorage.getItem("selectedJob"));
  const jobRole = jobselected?.jobClassification || "Not Specified";

  const feedback = generateJobSpecificReport(jobRole, scores);
  const container = document.getElementById("reportContainer");
  const cultureContainer = document.getElementById("cultureProfileContainer"); // Separate container

  container.innerHTML = "<h4>Detailed Analysis of Results</h4><hr>";
  cultureContainer.innerHTML = "<h4>Professional Culture Profile</h4><hr>"; // Heading for Culture Profile

  const evaluationResults = []; // Array to store results for localStorage & DB

  for (const trait in scores) {
      const score = scores[trait];
      const rangeLabel = getRangeLabel(score, trait);
      const description = descriptions[trait][rangeLabel];
      const feedbackText = feedback[trait] || 'No specific feedback available.';

      // Store in array
      evaluationResults.push({
          trait: trait.replace(/_/g, " "),
          score: score,
          description: description,
          jobCompatibility: feedbackText
      });

      // Check if the trait is "Professional Culture Profile" and display it separately
      if (trait === "Professional_Culture_Profile") {
          cultureContainer.innerHTML += `
            <div class="mb-3">
              ${description}<br>
              <em><strong>Job Compatibility:</strong></em> ${feedbackText}
            </div><hr>`;
      } else {
          // Display other traits normally
          container.innerHTML += `
            <div class="mb-3">
              <strong>${trait.replace(/_/g, " ")}:</strong><br>
              ${description}<br>
              <em><strong>Job Compatibility:</strong></em> ${feedbackText}
            </div><hr>`;
      }
  }

  // Save to localStorage
  localStorage.setItem("evaluationResults", JSON.stringify(evaluationResults));

  // ✅ Send data to backend
  await saveEvaluationToDB(candidateId, evaluationResults, ScoresFactor);
}


// Function to Send Data to Backend
async function saveEvaluationToDB(candidateId, evaluationResults) {
  try {
      const response = await fetch("https://hitbackend.onrender.com/api/saveEvaluation", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              candidateId: candidateId,
              evaluationResults: evaluationResults,
              ScoresFactor:ScoresFactor
          }),
      });

      if (!response.ok) throw new Error("Failed to save evaluation");

      console.log("Evaluation results saved successfully!");
  } catch (error) {
      console.error("Error saving evaluation:", error);
  }
}




/**
 * Submit candidate form data to backend API.
 * Clears localStorage after successful submission.
 */

function generateChart() {
  const jobselected = JSON.parse(localStorage.getItem("selectedJob"));
  const jobRole = jobselected?.jobClassification || "Not Specified";
  const rawScores = calculateScores();  // Calculate raw scores
  const labels = [];
  const data = [];
  let totalScore = 0;

  // Fixed colors for each trait
  const traitColors = {
    "Openness": "#ff6384",
    "Conscientiousness": "#36a2eb",
    "Extroversion": "#ffcd56",
    "Agreeableness": "#4bc0c0",
    "Emotional Stability": "#9966ff",
    "Critical Thinking": "#ff9f40",
    "Communication Skills": "#c9cbcf",
    "Leadership Ability": "#ff6666",
  };

  for (const [trait, score] of Object.entries(rawScores)) {
    const weight = getJobSpecificWeight(jobRole, trait, score);  // Calculate weight
    const percentage = (weight / 5) * 100;  // Convert weight to percentage
    data.push(percentage);
    labels.push(trait.replace(/_/g, ' '));  // Format trait names
    totalScore += percentage;
  }

  // Assign colors AFTER labels are populated
  const backgroundColors = labels.map(label => traitColors[label] || "#000000");  // Default black if not found


  const ctx = document.getElementById("traitChart").getContext("2d");

  // Destroy previous chart instance if exists (prevents duplication issues)
  if (window.myChart) {
    window.myChart.destroy();
  }

  // Create new chart
  window.myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Weighted Trait Scores',
        data: data,
        backgroundColor: backgroundColors,
      }]
    },
    options: {
      cutout: '50%',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
          position: 'bottom'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              return `${context.raw.toFixed(2)}% compatible`;  // Show only percentage
            }
          }
        }
      }
    },
    plugins: [{
      afterDraw: function(chart) {
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        const ctx = chart.ctx;
        
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '18px Arial';
    
        // First line (Percentage)
        ctx.fillText(`${assessmentTotal.toFixed(2)}%`, centerX, centerY - 8);
    
        // Second line (Compatible)
        ctx.font = '16px Arial'; // Slightly smaller font for second line
        ctx.fillText("compatible", centerX, centerY + 10);
        
        ctx.restore();
      }
    }]
    
  });
}






let assessmentTotal;


let candidateId;

window.onload = function () {
  
  jobSpecificTotal = calculateJobSpecificScore();
  generateChart();
  const detail = JSON.parse(localStorage.getItem("candidateDetails"));
  candidateId = generateCandidateId(detail.firstName, detail.lastName, detail.phone);
  generateReport();
  candidatedetailstosheet();
  assessmenettosheet();
  submitCandidateForm();
};
const ScoresFactor= [];

function calculateJobSpecificScore() {
  const rawScores = calculateScores();

  const jobselected = JSON.parse(localStorage.getItem("selectedJob"));
  const candidate = JSON.parse(localStorage.getItem("candidateDetails"));
  console.log(candidate);

  if (!jobselected || !candidate) {
    console.warn("Missing job or candidate details in localStorage.");
    return 0;
  }

  const jobRole = jobselected?.jobClassification || "Not Specified";
  let totalScore = 0;

  // 1️⃣ **Calculate Trait-based Score**
  for (const [trait, score] of Object.entries(rawScores)) {
    const weight = getJobSpecificWeight(jobRole, trait, score);
    totalScore += weight;
  }

  // 2️⃣ **Calculate Additional Factors Score**
  const factorScore = calculateAdditionalFactors(candidate, jobselected);
  totalScore = (totalScore/40) * 100;
  assessmentTotal = totalScore;
  ScoresFactor.push({Name: "Psychological Evaluation", Score: assessmentTotal});
  
  localStorage.setItem("ScoresFactor", JSON.stringify(ScoresFactor));

console.log("Factor Scores:", ScoresFactor);  // Debugging log
  totalScore += factorScore;
  totalScore = (totalScore / 6);
  return totalScore;
}

function calculateAdditionalFactors(candidate, jobselected) {
  
  let factorScore = 0;
  let locscore = 1;

  // **1️⃣ Location Distance Score**
  const locationMapping = {
    "1-5": 5,
    "5-10": 4,
    "10-15": 3,
    "15-20": 2,
    "20+": 1,
  };
  locscore = locationMapping[candidate.jobDistance] || 0;
  locscore = (locscore / 5)*100;
  ScoresFactor.push({
    Name: "Location",
    Score: locscore
  });

  // **2️⃣ Education Score (Dynamic Comparison)**
  const educationLevels = ["BS", "MS"]; // Order matters
  const requiredEducation = jobselected?.education;
  const candidateEducation = candidate?.education;

  let eduScore = 1; // Default to lowest score
  if (
    educationLevels.indexOf(candidateEducation) >=
    educationLevels.indexOf(requiredEducation)
  ) {
    eduScore = 5; // Higher or Required Level
  } else {
    eduScore = 1; // Lower Level
  }
  eduScore = (eduScore / 5)*100;
  ScoresFactor.push({
    Name: "Education",
    Score: eduScore
  });

  // **3️⃣ Experience Score (Dynamic Comparison)**
  const experienceLevels = ["1-2", "3-5", "5+"]; // Order matters
  const requiredExperience = jobselected?.experience;
  const candidateExperience = candidate?.experience;

  let expScore = 1; // Default to lowest score
  const requiredIndex = experienceLevels.indexOf(requiredExperience);
  const candidateIndex = experienceLevels.indexOf(candidateExperience);

  if (candidateIndex === requiredIndex) {
    expScore = 5; // Matches required range
  } else if (candidateIndex === requiredIndex - 1) {
    expScore = 3; // 1 range below 
  } else if (candidateIndex < requiredIndex - 1) {
    expScore = 1; // 2 or more ranges below
  }
  expScore = (expScore / 5)*100;
  ScoresFactor.push({
    Name: "Experience",
    Score: expScore
  });

  // **4️⃣ Certification Score**
  const requiredCerts = jobselected?.certifications || [];
  const candidateCerts = candidate?.certifications || [];
  const matchedCerts = caseInsensitiveMatch(candidateCerts, requiredCerts);
  let certScore = (matchedCerts / (requiredCerts.length || 1)) * 5;
  certScore = (certScore / 5)*100;
  ScoresFactor.push({
    Name: "Certificates",
    Score: certScore
  });

  // **5️⃣ Tools Score**
  const requiredTools = jobselected?.tools || [];
  const candidateTools = candidate?.tools || [];
  const matchedTools = caseInsensitiveMatch(candidateTools, requiredTools);
  let toolsScore = (matchedTools / (requiredTools.length || 1)) * 5;
  toolsScore = (toolsScore/5)*100;
  ScoresFactor.push({
    Name: "Tools",
    Score: toolsScore
  });


  factorScore = (locscore+eduScore+expScore+certScore+toolsScore);

  return factorScore;
}

function caseInsensitiveMatch(array1, array2) {
  const normalizedArray1 = array1.map((item) => item.toLowerCase().trim());
  const normalizedArray2 = array2.map((item) => item.toLowerCase().trim());

  return normalizedArray1.filter((item) => normalizedArray2.includes(item))
    .length;
}

function getJobSpecificWeight(jobRole, category, score) {
  const scoringMatrix = {
    PM: {
      Extroversion: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Conscientiousness: [
        [13, 28, 1],
        [29, 44, 2],
        [45, 59, 3],
        [60, 75, 4],
        [76, 91, 5],
      ],
      Openness: [
        [12, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Agreeableness: [
        [10, 21, 4],
        [22, 33, 5],
        [34, 45, 3],
        [46, 57, 2],
        [58, 70, 1],
      ],
      Emotional_Stability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Communication_Skills: [
        [11, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Critical_Thinking: [
        [6, 12, 1],
        [13, 19, 2],
        [20, 27, 3],
        [28, 34, 4],
        [35, 42, 5],
      ],
      Leadership_Ability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      // Professional_Culture_Profile: [[9,19,1], [20,30,2], [31,41,3], [42,52,4], [53,63,5]]
    },
    Clerical: {
      Extroversion: [
        [9, 19, 4],
        [20, 30, 5],
        [31, 41, 3],
        [42, 52, 2],
        [53, 63, 1],
      ],
      Conscientiousness: [
        [13, 28, 1],
        [29, 44, 2],
        [45, 59, 3],
        [60, 75, 4],
        [76, 91, 5],
      ],
      Openness: [
        [12, 26, 4],
        [27, 40, 5],
        [41, 55, 3],
        [56, 69, 2],
        [70, 84, 1],
      ],
      Agreeableness: [
        [10, 21, 1],
        [22, 33, 2],
        [34, 45, 3],
        [46, 57, 4],
        [58, 70, 5],
      ],
      Emotional_Stability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Communication_Skills: [
        [11, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Critical_Thinking: [
        [6, 12, 1],
        [13, 19, 2],
        [20, 27, 3],
        [28, 34, 4],
        [35, 42, 3],
      ],
      Leadership_Ability: [
        [9, 19, 4],
        [20, 30, 5],
        [31, 41, 3],
        [42, 52, 2],
        [53, 63, 1],
      ],
    },
    QA: {
      Extroversion: [
        [9, 19, 4],
        [20, 30, 5],
        [31, 41, 3],
        [42, 52, 2],
        [53, 63, 1],
      ],
      Conscientiousness: [
        [13, 28, 1],
        [29, 44, 2],
        [45, 59, 3],
        [60, 75, 4],
        [76, 91, 5],
      ],
      Openness: [
        [12, 26, 4],
        [27, 40, 5],
        [41, 55, 3],
        [56, 69, 2],
        [70, 84, 1],
      ],
      Agreeableness: [
        [10, 21, 1],
        [22, 33, 2],
        [34, 45, 3],
        [46, 57, 4],
        [58, 70, 5],
      ],
      Emotional_Stability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Communication_Skills: [
        [11, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Critical_Thinking: [
        [6, 12, 1],
        [13, 19, 2],
        [20, 27, 3],
        [28, 34, 4],
        [35, 42, 5],
      ],
      Leadership_Ability: [
        [9, 19, 4],
        [20, 30, 5],
        [31, 41, 3],
        [42, 52, 2],
        [53, 63, 1],
      ],
    },
    Dev: {
      Extroversion: [
        [9, 19, 4],
        [20, 30, 5],
        [31, 41, 3],
        [42, 52, 2],
        [53, 63, 1],
      ],
      Conscientiousness: [
        [13, 28, 1],
        [29, 44, 2],
        [45, 59, 3],
        [60, 75, 4],
        [76, 91, 5],
      ],
      Openness: [
        [12, 26, 4],
        [27, 40, 5],
        [41, 55, 3],
        [56, 69, 2],
        [70, 84, 1],
      ],
      Agreeableness: [
        [10, 21, 1],
        [22, 33, 3],
        [34, 45, 5],
        [46, 57, 3],
        [58, 70, 5],
      ],
      Emotional_Stability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Communication_Skills: [
        [11, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Critical_Thinking: [
        [6, 12, 1],
        [13, 19, 2],
        [20, 27, 3],
        [28, 34, 4],
        [35, 42, 5],
      ],
      Leadership_Ability: [
        [9, 19, 4],
        [20, 30, 5],
        [31, 41, 3],
        [42, 52, 2],
        [53, 63, 1],
      ],
    },
    BA: {
      Extroversion: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Conscientiousness: [
        [13, 28, 1],
        [29, 44, 2],
        [45, 59, 3],
        [60, 75, 4],
        [76, 91, 5],
      ],
      Openness: [
        [12, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Agreeableness: [
        [10, 21, 1],
        [22, 33, 2],
        [34, 45, 3],
        [46, 57, 4],
        [58, 70, 5],
      ],
      Emotional_Stability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
      Communication_Skills: [
        [11, 26, 1],
        [27, 40, 2],
        [41, 55, 3],
        [56, 69, 4],
        [70, 84, 5],
      ],
      Critical_Thinking: [
        [6, 12, 1],
        [13, 19, 2],
        [20, 27, 3],
        [28, 34, 4],
        [35, 42, 5],
      ],
      Leadership_Ability: [
        [9, 19, 1],
        [20, 30, 2],
        [31, 41, 3],
        [42, 52, 4],
        [53, 63, 5],
      ],
    },
    // Add other jobs if needed
  };

  const jobMatrix = scoringMatrix[jobRole];

  if (!jobMatrix || !jobMatrix[category]) {
    console.warn(`No job-specific matrix found for ${jobRole} - ${category}`);
    return 0; // Fail safe if job or category is not configured
  }

  for (const [min, max, weight] of jobMatrix[category]) {
    if (score >= min && score <= max) {
      return weight;
    }
  }
  return 0; // Default fallback
}

async function submitCandidateForm() {

  const formData = new FormData();
  const storedResume = localStorage.getItem("candidateResume"); // Get resume from local storage
  const detail = JSON.parse(localStorage.getItem("candidateDetails"));
  console.log(detail);

  formData.append("jobId", detail?.jobId || "Not Specified");
  formData.append("candidateId", candidateId); // Append resume to form data
  formData.append("firstName", detail?.firstName || "Not Specified");
  formData.append("lastName", detail?.lastName || "Not Specified");
  formData.append("email", detail?.email || "Not Specified");
  formData.append("phone", detail?.phone || "Not Specified");
  formData.append("education", detail?.education || "Not Specified");
  formData.append("experience", detail?.experience || "Not Specified");
  formData.append("linkedin", detail?.linkedin || "Not Specified");
  formData.append("address", detail?.address || "Not Specified");
  
  formData.append("totalScore", jobSpecificTotal);
  formData.append(
    "skills",
    Array.isArray(detail?.skills)
      ? detail.skills.join(", ")
      : detail?.skills || "Not Specified"
  );

  // Append certifications as an array
  const certifications = detail?.certifications || [];
  certifications.forEach((cert) => {
    formData.append("certifications", cert);
  });

  // Append tools as an array
  const tools = detail?.tools || [];
  tools.forEach((tool) => {
    formData.append("tools", tool);
  });

  // Attach Resume as Base64
  if (storedResume) {
    const byteCharacters = atob(storedResume.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const resumeFile = new Blob([byteArray], { type: "application/pdf" });

    formData.append("resume", resumeFile, "resume.pdf");
  }

  try {
    const response = await fetch("https://hitbackend.onrender.com/api/candidates", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // ✅ Clear all relevant localStorage items **only after successful submission**
    localStorage.removeItem("candidateResume");
    localStorage.removeItem("candidateDetails");
    localStorage.removeItem("assessmentAnswers");
    localStorage.removeItem("selectedJob");
    localStorage.clear();
  } catch (err) {
    alert(`Error submitting form: ${err.message}`);
    console.error("Submission failed", err);
  }
}


const generateCandidateId = (firstName, lastName, phone) => {
  const firstInitial = firstName.substr(0, 2).toUpperCase(); // First 2 letters of first name
  const lastInitial = lastName.substr(-2).toUpperCase(); // Last 2 letters of last name
  const phonePart = phone.replace(/[^0-9]+/g, '').slice(-4); // Last 4 digits of phone number
  return `${firstInitial}${lastInitial}${phonePart}`;
};

async function candidatedetailstosheet() {
  const detail = JSON.parse(localStorage.getItem("candidateDetails"));


  const candidateData = {
      candidateId,
      firstName: detail?.firstName || "Not Specified",
      lastName: detail?.lastName || "Not Specified",
      email: detail?.email || "Not Specified",
      phone: detail?.phone || "Not Specified",
      education: detail?.education || "Not Specified",
      experience: detail?.experience || "Not Specified",
      linkedin: detail?.linkedin || "Not Specified",
      address: detail?.address || "Not Specified",
      totalScore: jobSpecificTotal || "0", // Assuming totalScore is part of 'detail'
      skills: detail?.skills ? detail.skills.join(", ") : "Not Specified",
      certifications: detail?.certifications ? detail.certifications.join(", ") : "Not Specified",
      tools: detail?.tools ? detail.tools.join(", ") : "Not Specified"
  };

  try {
      const response = await fetch('https://hitbackend.onrender.com/api/candidateToSheet', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
  } catch (err) {
      alert(`Error submitting form: ${err.message}`);
      console.error("Submission failed", err);
  }
}


async function assessmenettosheet() {
  const scores = calculateScores();


  const candidateData = {
      candidateId,
      agreeableness: scores.Agreeableness || "Not Specified",
        communicationSkills: scores.Communication_Skills|| "Not Specified",
        conscientiousness: scores.Conscientiousness || "Not Specified",
        criticalThinking: scores.Critical_Thinking || "Not Specified",
        emotionalStability: scores.Emotional_Stability || "Not Specified",
        extroversion: scores.Extroversion || "Not Specified",
        leadershipAbility: scores.Leadership_Ability || "Not Specified",
        openness: scores.Openness || "Not Specified",
        professionalCultureProfile: scores.Professional_Culture_Profile || "Not Specified"
  };
  console.log(candidateData);


  try {
      const response = await fetch('https://hitbackend.onrender.com/api/assessmentosheet', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
  } catch (err) {
      alert(`Error submitting form: ${err.message}`);
      console.error("Submission failed", err);
  }
}