-- Telefon nömrəsi hesablar arasında unikal olmalıdır (boş/qeyri-müəyyən NULL qala bilər).
ALTER TABLE users ADD CONSTRAINT uk_users_phone UNIQUE (phone_number);
