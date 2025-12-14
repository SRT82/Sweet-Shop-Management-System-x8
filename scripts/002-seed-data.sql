-- Insert sample sweets data
INSERT INTO sweets (name, description, price, stock, category, image_url) VALUES
  ('Chocolate Truffles', 'Rich, creamy chocolate truffles with a smooth ganache center', 12.99, 50, 'Chocolate', '/placeholder.svg?height=200&width=200'),
  ('Gummy Bears', 'Colorful, chewy gummy bears in assorted fruit flavors', 5.99, 100, 'Gummies', '/placeholder.svg?height=200&width=200'),
  ('Lollipops', 'Classic spiral lollipops in rainbow colors', 3.99, 75, 'Hard Candy', '/placeholder.svg?height=200&width=200'),
  ('Caramel Squares', 'Soft, buttery caramel squares wrapped individually', 8.99, 60, 'Caramel', '/placeholder.svg?height=200&width=200'),
  ('Mint Chocolates', 'Refreshing mint chocolate squares with dark chocolate coating', 10.99, 45, 'Chocolate', '/placeholder.svg?height=200&width=200'),
  ('Sour Worms', 'Tangy sour gummy worms with a sugar coating', 6.99, 80, 'Gummies', '/placeholder.svg?height=200&width=200'),
  ('Fruit Jellies', 'Soft fruit-flavored jellies dusted with sugar', 7.99, 55, 'Jellies', '/placeholder.svg?height=200&width=200'),
  ('Peanut Brittle', 'Crunchy peanut brittle with roasted peanuts', 9.99, 40, 'Brittle', '/placeholder.svg?height=200&width=200'),
  ('Cotton Candy', 'Light and fluffy cotton candy in pink and blue', 4.99, 30, 'Cotton Candy', '/placeholder.svg?height=200&width=200'),
  ('Chocolate Fudge', 'Creamy chocolate fudge squares', 11.99, 35, 'Chocolate', '/placeholder.svg?height=200&width=200')
ON CONFLICT DO NOTHING;
