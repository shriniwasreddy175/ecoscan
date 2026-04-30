INSERT INTO carbon_factors (material, emission_per_kg)
VALUES
-- Textiles
('Cotton', 2.1),
('Polyester',5.5),
('Wool', 8.0),
('Silk', 11.0),
('Nylon', 6.5),
('Acrylic', 7.0),
('Denim', 3.5),

-- Plastics
('Recycled Plastic', 2.5),
('PVC', 6.0),
('Polypropylene', 5.0),
('Bioplastic', 1.8),

-- Metals
('Aluminium', 8.5),
('Recycled Aluminium', 2.0),
('Copper', 4.0),
('Iron', 2.0),

-- Wood & Paper
('Plywood', 1.2),
('MDF', 1.5),
('Paper', 1.0),
('Recycled Paper', 0.5),
('Cardboard', 0.8),

-- Electronics Components
('Glass', 1.5),
('Silicon', 3.0),
('Lithium', 15.0),

-- Packaging
('Packaging Plastic', 5.5),
('Packaging Paper', 1.0),

-- Others
('Rubber', 3.0),
('Leather', 10.0),
('Synthetic Leather', 6.5)
ON CONFLICT DO NOTHING;