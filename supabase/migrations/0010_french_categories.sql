-- Translate category copy to French (the app's only supported language).
update public.categories set name = 'Yoga', description = 'Un mouvement fluide pour construire force, aisance et conscience du corps.' where slug = 'yoga';
update public.categories set name = 'Méditation', description = 'Des séances guidées pour apaiser l''esprit et construire une pratique régulière.' where slug = 'meditation';
update public.categories set name = 'Respiration', description = 'Des exercices de respiration pour réguler votre système nerveux en quelques minutes.' where slug = 'breathing';
update public.categories set name = 'Relaxation', description = 'Des séances lentes et réparatrices pour relâcher les tensions physiques.' where slug = 'relaxation';
update public.categories set name = 'Sommeil', description = 'Des rituels de fin de journée et des paysages sonores pour vous aider à vous endormir.' where slug = 'sleep';
update public.categories set name = 'Flexibilité', description = 'Des étirements profonds pour améliorer votre mobilité et votre amplitude de mouvement.' where slug = 'flexibility';
