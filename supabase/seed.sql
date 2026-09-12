-- Categories only. Videos are added through the admin panel (/admin/videos)
-- using YouTube links — there is no video seed data.
insert into public.categories (name, slug, description, image_path, sort_order) values
  ('Yoga', 'yoga', 'Un mouvement fluide pour construire force, aisance et conscience du corps.', 'categories/yoga.jpg', 1),
  ('Méditation', 'meditation', 'Des séances guidées pour apaiser l''esprit et construire une pratique régulière.', 'categories/meditation.jpg', 2),
  ('Respiration', 'breathing', 'Des exercices de respiration pour réguler votre système nerveux en quelques minutes.', 'categories/breathing.jpg', 3),
  ('Relaxation', 'relaxation', 'Des séances lentes et réparatrices pour relâcher les tensions physiques.', 'categories/relaxation.jpg', 4),
  ('Sommeil', 'sleep', 'Des rituels de fin de journée et des paysages sonores pour vous aider à vous endormir.', 'categories/sleep.jpg', 5),
  ('Flexibilité', 'flexibility', 'Des étirements profonds pour améliorer votre mobilité et votre amplitude de mouvement.', 'categories/flexibility.jpg', 6)
on conflict (slug) do nothing;
