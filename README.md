## HomeReady - Many Paths to Owning a Home

Are you between 18 and 30 wanting to own a home someday? But you don’t know what factors influence your ability to obtain a mortgage? HomeReady helps you gain financial literacy through gamification.

# Inspiration

Young adults often come to a stage in their lives where they want to own a home. They make an appointment with a company such as Interhyp, asking for an overview of mortgage options. Often, they discover that they do not meet the requirements for their ideal loan for a house or an apartment, or that the process is much more tedious than it was anticipated. 

To help people understand what factors and life decisions influence mortgages, our platform HomeReady aims at educating people about the process of obtaining mortgages, explaining key financial terms and allowing users to play through different scenarios of life paths and property goals.

# What it does

Our target group focuses on young people between the ages of 18 and 30. Every user can set up an account and create different fictional avatars with distinct attributes such as age and occupation. The idea behind this is to allow users to play through different life scenarios, allowing them to better understand how life choices influence the mortgages. 

After defining who the avatar is, the player chooses the property goal they want the avatar to have (owning a house, an apartment, a loft, or a penthouse). Then, the actual game begins where the player can choose the next life step such as the option of pursuing a degree or starting a family. With each decision, the player receives a small text explaining whether the avatar would be eligible for a mortgage at this point in the future and when it would receive it based on average interest rates and the information given.

Next to the avatar story line, we also foster games to acquire knowledge on financial literacy in regards to mortgages. For example, we have a knowledge tab where the player can interactively learn by playing a quiz and earning a badge in the end. Furthermore, we plan on integrating an Interhyp avatar that explains financial concepts and tips & tricks in more detail throughout the game.

# How we built it

We used JavaScript to write the game code. In particular, for the frontend component, we used React and Tailwind CSS, and for the backend part, we relied on Node.js. Furthermore, we established a database using PostgreSQL locally that stored all users and avatars. Additionally, we created a machine learning model that predicts the number of years needed for obtaining a mortgage based on factors such as income, occupation, savings, and debt.

# Challenges we ran into

While we all had some experience in JavaScript, it was challenging to understand how real Web Development works when using tools such as React and Node.js. The separation of frontend and backend with each corresponding file structure was useful for dividing up work and for clear organization. However, it was difficult to connect both parts. Especially since we established a database, we had issues in understanding why the data was not fetched and processed properly, leading to many hours of debugging. Furthermore, the integration of the python-based ML model into our web system was challenging and resulted in considerable debugging time as well.

# Accomplishments 

On the one hand, we produced a clear functioning backend, frontend, and database that provides a good code organisation and contributes to a functioning game. Also, the user design is quite interactive and playful, aiming at engaging the player. More generally speaking, we are proud to have undertaken this challenge since we learned a lot about what it means to create a software product from scratch and under a time constraint. 

# What's next for HomeReady

This is the first prototype of HomeReady, and we have many more features in mind that can be implemented into the game, boosting engagement, fun, and overall learning experience. But before we can implement all those new, exciting ideas, all team members need to go home and get a proper amount of sleep first.
