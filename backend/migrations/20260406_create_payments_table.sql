-- 20260406_create_payments_table.sql

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  proposal_id INT NULL,
  professional_id INT NOT NULL,
  contractor_id INT NOT NULL,
  professional_name VARCHAR(255) NOT NULL,
  service_title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  mp_preference_id VARCHAR(255) NULL,
  mp_payment_id VARCHAR(255) NULL,
  status ENUM('pending', 'approved', 'rejected', 'paid', 'released', 'cancelled', 'disputed') DEFAULT 'pending',
  commission_amount DECIMAL(10,2) DEFAULT 0.00,
  commission_percent DECIMAL(5,2) DEFAULT 15.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service_status (service_id, status),
  INDEX idx_professional (professional_id),
  INDEX idx_contractor (contractor_id),
  INDEX idx_status (status),
  INDEX idx_mp_payment (mp_payment_id)
);

-- Trigger for updated_at
DELIMITER $$
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

