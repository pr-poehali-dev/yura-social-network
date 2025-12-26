CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    
    message_sound BOOLEAN DEFAULT TRUE,
    call_sound BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    show_online_status BOOLEAN DEFAULT TRUE,
    send_read_receipts BOOLEAN DEFAULT TRUE,
    two_factor_auth BOOLEAN DEFAULT FALSE,
    
    dark_theme BOOLEAN DEFAULT FALSE,
    animations BOOLEAN DEFAULT TRUE,
    
    hd_quality BOOLEAN DEFAULT TRUE,
    noise_cancellation BOOLEAN DEFAULT TRUE,
    auto_answer BOOLEAN DEFAULT FALSE,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);