-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- AVATARS
CREATE TABLE avatars (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    age INT,
    occupation VARCHAR(100),
    income INT,
    savings INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- GOALS
CREATE TABLE avatar_goals (
    id SERIAL PRIMARY KEY,
    avatar_id INT UNIQUE NOT NULL,
    goal_type VARCHAR(50),
    rooms INT,
    location VARCHAR(255),
    FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE
);

-- PRICE ESTIMATE
CREATE TABLE price_estimates (
    id SERIAL PRIMARY KEY,
    goal_id INT UNIQUE NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES avatar_goals(id) ON DELETE CASCADE
);

-- LIFE EVENTS
CREATE TABLE life_events (
    id SERIAL PRIMARY KEY,
    avatar_id INT NOT NULL,
    event_type VARCHAR(100),
    delta_income INT DEFAULT 0,
    delta_savings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE
);

-- MORTGAGE RESULT
CREATE TABLE mortgage_eligibility (
    id SERIAL PRIMARY KEY,
    avatar_id INT UNIQUE NOT NULL,
    eligible_from DATE,
    recommended_downpayment INT,
    monthly_payment INT,
    FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE
);
