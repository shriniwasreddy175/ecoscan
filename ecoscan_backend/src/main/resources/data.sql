INSERT INTO carbon_factors (material, emission_per_kg)
VALUES
('Cotton', 2.1),
('Polyester', 5.5),
('Steel', 1.9),
('Plastic', 6.0),
('Wood', 0.8)
ON CONFLICT DO NOTHING;