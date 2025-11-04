-- Seed script for African Heritage Proverbs Platform
-- This script populates the database with authentic African proverbs and sample user profiles

-- First, create some sample user profiles
-- Note: In a real scenario, these would be created through the auth system
-- For seeding purposes, we'll insert directly with generated UUIDs

INSERT INTO public.profiles (id, username, email, bio, country, avatar_url, points, is_admin, is_verified, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'african_wisdom', 'wisdom@africanheritage.com', 'Guardian of African proverbs and cultural wisdom', 'Ghana', '/placeholder-user.jpg', 2500, true, true, NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440001', 'proverb_master', 'master@africanheritage.com', 'Dedicated to preserving African oral traditions', 'Nigeria', '/placeholder-user.jpg', 1800, false, true, NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440002', 'cultural_keeper', 'keeper@africanheritage.com', 'Sharing the wisdom of our ancestors', 'Kenya', '/placeholder-user.jpg', 1200, false, true, NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440003', 'storyteller', 'teller@africanheritage.com', 'Bringing African stories to the world', 'South Africa', '/placeholder-user.jpg', 950, false, false, NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440004', 'wisdom_seeker', 'seeker@africanheritage.com', 'Learning from the wisdom of Africa', 'Tanzania', '/placeholder-user.jpg', 650, false, false, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440005', 'heritage_guardian', 'guardian@africanheritage.com', 'Protecting African cultural heritage', 'Senegal', '/placeholder-user.jpg', 400, false, false, NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440006', 'proverb_lover', 'lover@africanheritage.com', 'Collecting proverbs from across Africa', 'Uganda', '/placeholder-user.jpg', 200, false, false, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440007', 'beginner_wise', 'beginner@africanheritage.com', 'Just starting my journey with African wisdom', 'Morocco', '/placeholder-user.jpg', 50, false, false, NOW() - INTERVAL '1 day');

-- Now insert authentic African proverbs from various regions and cultures
-- Each proverb includes: proverb text, meaning, context, country, language, categories

INSERT INTO public.proverbs (user_id, proverb, meaning, context, country, language, categories, is_verified, is_featured, views, shares, created_at) VALUES

-- West Africa Proverbs
('550e8400-e29b-41d4-a716-446655440000', 'Ile la n ti n jade, a o pada si', 'Home is where we come from, and we will return to it', 'This proverb emphasizes the importance of roots and returning to one''s origins', 'Nigeria', 'Yoruba', ARRAY['wisdom', 'family', 'identity'], true, true, 150, 25, NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440001', 'Se wo were fi na wosan kofa a yennkyi', 'When you climb a good tree, you get a good shadow', 'Advises choosing good company and associations in life', 'Ghana', 'Akan', ARRAY['wisdom', 'relationships', 'success'], true, true, 200, 40, NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Xam-xam la bokk', 'Knowledge is like a baobab tree', 'Knowledge is vast, enduring, and provides shelter for many', 'Senegal', 'Wolof', ARRAY['wisdom', 'education', 'endurance'], true, false, 120, 15, NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440001', 'A kieŋ kaŋŋaŋ', 'The elephant does not reject its own child', 'Family bonds are unbreakable and unconditional', 'Mali', 'Bambara', ARRAY['family', 'unity', 'love'], true, false, 95, 10, NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Ko te sira kono', 'No one shows the dry season the way', 'Experience cannot be taught; it must be lived', 'Burkina Faso', 'Bambara', ARRAY['wisdom', 'experience', 'learning'], true, false, 85, 8, NOW() - INTERVAL '12 days'),

-- East Africa Proverbs
('550e8400-e29b-41d4-a716-446655440002', 'Haba na haba hujaza kibaba', 'Little by little fills the measure', 'Consistent small efforts lead to significant results', 'Kenya', 'Swahili', ARRAY['success', 'patience', 'perseverance'], true, true, 300, 60, NOW() - INTERVAL '22 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Moyo wa kupenda hauna makosa', 'A loving heart has no faults', 'Love overlooks imperfections and sees only good', 'Tanzania', 'Swahili', ARRAY['love', 'forgiveness', 'compassion'], true, false, 180, 30, NOW() - INTERVAL '19 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Akawuka tewali kwebaka', 'He who wakes up early catches the worm', 'Being proactive and starting early brings rewards', 'Uganda', 'Luganda', ARRAY['success', 'discipline', 'opportunity'], true, false, 140, 20, NOW() - INTERVAL '16 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Heri kufa macho kuliko kufa moyo', 'Better to die with open eyes than with a closed heart', 'It is better to face reality than live in denial', 'Tanzania', 'Swahili', ARRAY['wisdom', 'courage', 'reality'], true, false, 110, 12, NOW() - INTERVAL '14 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Mwenye nguvu mpigie mbio', 'Let the strong one run the race', 'Each person should do what they are best suited for', 'Kenya', 'Swahili', ARRAY['wisdom', 'strength', 'capability'], true, false, 90, 9, NOW() - INTERVAL '11 days'),

-- Southern Africa Proverbs
('550e8400-e29b-41d4-a716-446655440003', 'Umuntu ngumuntu ngabantu', 'A person is a person because of other people', 'Humanity and community are essential to individual identity', 'South Africa', 'Zulu', ARRAY['unity', 'community', 'humanity'], true, true, 400, 80, NOW() - INTERVAL '28 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Mwana wa nyoka ni nyoka', 'A child of a snake is a snake', 'Children inherit the characteristics of their parents', 'Zimbabwe', 'Shona', ARRAY['family', 'heritage', 'nature'], true, false, 160, 25, NOW() - INTERVAL '17 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Moyo murefu ulalo', 'A patient heart rests', 'Patience brings peace and resolution', 'Malawi', 'Chichewa', ARRAY['patience', 'peace', 'wisdom'], true, false, 130, 18, NOW() - INTERVAL '13 days'),
('550e8400-e29b-41d4-a716-446655440005', 'Lebitla la motho ke sebaka sa hae', 'A person''s grave is their home', 'Death is the final resting place for everyone', 'Lesotho', 'Sesotho', ARRAY['life', 'death', 'reality'], true, false, 75, 6, NOW() - INTERVAL '9 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Mpheta ya kgomo ke letsopa', 'The hide of a cow is mud', 'Things are not always what they appear to be', 'Botswana', 'Setswana', ARRAY['wisdom', 'appearance', 'reality'], true, false, 100, 11, NOW() - INTERVAL '10 days'),

-- North Africa Proverbs
('550e8400-e29b-41d4-a716-446655440005', 'Al-ʿajalah taʾkul al-ḥajalah', 'Haste makes waste', 'Rushing leads to mistakes and poor results', 'Egypt', 'Arabic', ARRAY['wisdom', 'patience', 'caution'], true, false, 220, 35, NOW() - INTERVAL '21 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Al-ʿadl fī al-ḥukm aḥsan min al-ʿadl fī al-ʿadl', 'Justice in judgment is better than justice in justice', 'Fair and proper judgment is crucial', 'Morocco', 'Arabic', ARRAY['justice', 'fairness', 'leadership'], true, false, 170, 28, NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440005', 'Al-sabr miftāh al-faraj', 'Patience is the key to relief', 'Patience leads to eventual success and comfort', 'Tunisia', 'Arabic', ARRAY['patience', 'hope', 'endurance'], true, false, 190, 32, NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440007', 'Man yaʿlam yaʿlam wa man lā yaʿlam yaʿlam', 'He who knows, knows, and he who doesn''t know, knows', 'The wise recognize wisdom, the ignorant do not', 'Algeria', 'Arabic', ARRAY['wisdom', 'knowledge', 'humility'], true, false, 60, 4, NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Al-ʿilm fī al-ṣaghīr wa al-ʿamal fī al-kabīr', 'Knowledge in the young, action in the old', 'Youth brings learning, age brings wisdom in action', 'Libya', 'Arabic', ARRAY['wisdom', 'age', 'experience'], true, false, 85, 7, NOW() - INTERVAL '6 days'),

-- Central Africa Proverbs
('550e8400-e29b-41d4-a716-446655440007', 'Moto moko te', 'One person is not enough', 'Unity and cooperation are essential for success', 'DRC', 'Lingala', ARRAY['unity', 'cooperation', 'strength'], true, false, 140, 22, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440000', 'No di worry, e go beta', 'Don''t worry, it will get better', 'Have faith that difficult times will pass', 'Cameroon', 'Pidgin English', ARRAY['hope', 'optimism', 'resilience'], true, false, 110, 15, NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440001', 'Bɔkɔɔ bɔkɔɔ ɔba', 'Slowly but surely', 'Steady progress leads to achievement', 'Ghana', 'Akan', ARRAY['patience', 'progress', 'success'], true, false, 125, 18, NOW() - INTERVAL '14 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Pole pole ndio mwendo', 'Slowly slowly is the way', 'Take your time to do things properly', 'Tanzania', 'Swahili', ARRAY['patience', 'quality', 'care'], true, false, 155, 26, NOW() - INTERVAL '16 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Unity is strength', 'United we stand, divided we fall', 'Collective action is more powerful than individual effort', 'South Africa', 'English', ARRAY['unity', 'strength', 'cooperation'], true, false, 180, 30, NOW() - INTERVAL '19 days'),

-- Additional West Africa Proverbs
('550e8400-e29b-41d4-a716-446655440004', 'A man who pays respect to the great paves the way for his own greatness', 'Respect for elders and authority leads to personal success', 'Used in leadership and mentorship contexts', 'Nigeria', 'English', ARRAY['respect', 'leadership', 'success'], true, false, 95, 12, NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440005', 'The child who is not embraced by the village will burn it down to feel its warmth', 'Community support is essential for individual well-being', 'Emphasizes the importance of community care', 'Ghana', 'English', ARRAY['community', 'care', 'belonging'], true, false, 135, 20, NOW() - INTERVAL '9 days'),
('550e8400-e29b-41d4-a716-446655440006', 'If you want to go fast, go alone. If you want to go far, go together', 'Individual speed vs collective endurance', 'Used in team building and long-term planning', 'Senegal', 'English', ARRAY['unity', 'strategy', 'endurance'], true, false, 200, 35, NOW() - INTERVAL '11 days'),
('550e8400-e29b-41d4-a716-446655440007', 'The heart of the wise man lies quiet like the waters of the lake', 'Wisdom brings inner peace and calm', 'Describes the demeanor of truly wise people', 'Mali', 'English', ARRAY['wisdom', 'peace', 'calm'], true, false, 70, 5, NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440000', 'When the roots are deep, there is no reason to fear the wind', 'Strong foundations provide stability', 'Used in personal development and resilience', 'Burkina Faso', 'English', ARRAY['strength', 'foundation', 'resilience'], true, false, 115, 16, NOW() - INTERVAL '6 days'),

-- Additional East Africa Proverbs
('550e8400-e29b-41d4-a716-446655440001', 'A bird that flies off the earth and lands on an anthill is still on the ground', 'No matter how high you rise, stay humble', 'Teaches humility and groundedness', 'Kenya', 'Swahili', ARRAY['humility', 'wisdom', 'perspective'], true, false, 145, 22, NOW() - INTERVAL '13 days'),
('550e8400-e29b-41d4-a716-446655440002', 'He who digs a pit for others falls into it himself', 'What goes around comes around', 'Warns against plotting harm to others', 'Tanzania', 'Swahili', ARRAY['justice', 'karma', 'caution'], true, false, 165, 28, NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440003', 'The fool speaks, the wise man listens', 'Wisdom is shown through listening rather than speaking', 'Encourages thoughtful communication', 'Uganda', 'English', ARRAY['wisdom', 'listening', 'communication'], true, false, 120, 17, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Smooth seas do not make skillful sailors', 'Challenges build character and skills', 'Used in motivation and personal growth', 'Kenya', 'English', ARRAY['growth', 'challenge', 'skill'], true, false, 175, 29, NOW() - INTERVAL '17 days'),
('550e8400-e29b-41d4-a716-446655440005', 'You cannot force a bird to land on your hand just because you have seed', 'You cannot control others'' choices', 'Teaches acceptance of others'' free will', 'Tanzania', 'English', ARRAY['freedom', 'acceptance', 'control'], true, false, 105, 13, NOW() - INTERVAL '8 days'),

-- Additional Southern Africa Proverbs
('550e8400-e29b-41d4-a716-446655440006', 'It is better to be a pirate than to join with the sinking ship', 'Choose wisely who you associate with', 'Advises against toxic relationships', 'South Africa', 'English', ARRAY['wisdom', 'relationships', 'choice'], true, false, 155, 24, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440007', 'The axe forgets but the tree remembers', 'Harm done to others is not easily forgotten', 'Warns about the lasting impact of actions', 'Zimbabwe', 'English', ARRAY['consequences', 'memory', 'justice'], true, false, 125, 19, NOW() - INTERVAL '9 days'),
('550e8400-e29b-41d4-a716-446655440000', 'A rolling stone gathers no moss', 'Movement prevents stagnation', 'Encourages action and progress', 'South Africa', 'English', ARRAY['action', 'progress', 'change'], true, false, 185, 31, NOW() - INTERVAL '14 days'),
('550e8400-e29b-41d4-a716-446655440001', 'When elephants fight, it is the grass that suffers', 'Conflicts between powerful people hurt the innocent', 'Used in conflict resolution contexts', 'Zimbabwe', 'English', ARRAY['conflict', 'innocence', 'power'], true, false, 195, 33, NOW() - INTERVAL '16 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Do not call the forest that shelters you a jungle', 'Do not criticize your benefactors', 'Teaches gratitude and respect', 'Botswana', 'English', ARRAY['gratitude', 'respect', 'criticism'], true, false, 95, 11, NOW() - INTERVAL '7 days'),

-- Additional North Africa Proverbs
('550e8400-e29b-41d4-a716-446655440003', 'The words of the elders become sweet in the mouth of the young', 'Wisdom from elders is valued by youth', 'Emphasizes respect for elders'' wisdom', 'Morocco', 'English', ARRAY['wisdom', 'respect', 'age'], true, false, 140, 21, NOW() - INTERVAL '11 days'),
('550e8400-e29b-41d4-a716-446655440004', 'A book is a garden carried in the pocket', 'Books provide knowledge and growth', 'Celebrates the value of reading and learning', 'Egypt', 'English', ARRAY['knowledge', 'books', 'growth'], true, false, 165, 27, NOW() - INTERVAL '13 days'),
('550e8400-e29b-41d4-a716-446655440005', 'The Nile does not flow backwards', 'Time moves forward, change is inevitable', 'Accepts the flow of time and change', 'Egypt', 'English', ARRAY['time', 'change', 'acceptance'], true, false, 150, 23, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440006', 'He who has health has hope; he who has hope has everything', 'Health is the foundation of all other blessings', 'Prioritizes physical and mental well-being', 'Tunisia', 'English', ARRAY['health', 'hope', 'wellbeing'], true, false, 175, 29, NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440007', 'The best answer to anger is silence', 'Silence is the best response to provocation', 'Teaches emotional control and wisdom', 'Algeria', 'English', ARRAY['wisdom', 'anger', 'control'], true, false, 85, 8, NOW() - INTERVAL '5 days'),

-- Additional Central Africa Proverbs
('550e8400-e29b-41d4-a716-446655440000', 'The laughter of a child is the light of the home', 'Children bring joy and light to families', 'Celebrates the importance of children', 'Cameroon', 'English', ARRAY['family', 'joy', 'children'], true, false, 130, 18, NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440001', 'A single stick may smoke, but it will not burn', 'Individual effort is limited; unity brings strength', 'Emphasizes the power of collective action', 'DRC', 'English', ARRAY['unity', 'strength', 'cooperation'], true, false, 160, 25, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440002', 'The path to the house of a friend is never long', 'True friendship makes distance irrelevant', 'Celebrates the value of genuine friendship', 'Gabon', 'English', ARRAY['friendship', 'loyalty', 'distance'], true, false, 115, 16, NOW() - INTERVAL '9 days'),
('550e8400-e29b-41d4-a716-446655440003', 'When the music changes, so does the dance', 'Adapt to changing circumstances', 'Encourages flexibility and adaptability', 'Central African Republic', 'English', ARRAY['change', 'adaptability', 'flexibility'], true, false, 105, 14, NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440004', 'The river that flows in the sky makes noise, but the one that flows on the ground is quiet', 'Empty threats vs real action', 'Distinguishes between talk and actual deeds', 'Chad', 'English', ARRAY['action', 'words', 'reality'], true, false, 95, 12, NOW() - INTERVAL '6 days'),

-- More Proverbs to reach 50+
('550e8400-e29b-41d4-a716-446655440005', 'A tree does not move unless there is wind', 'Change requires external force', 'Explains the need for motivation or catalyst', 'Ghana', 'Akan', ARRAY['change', 'motivation', 'action'], true, false, 110, 15, NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440006', 'The frog does not jump in the daytime without reason', 'Actions have underlying motives', 'Encourages understanding of intentions', 'Nigeria', 'Yoruba', ARRAY['wisdom', 'motives', 'understanding'], true, false, 125, 18, NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440007', 'If you close your eyes to facts, you will learn through accidents', 'Ignoring reality leads to painful lessons', 'Warns against denial and ignorance', 'Kenya', 'Swahili', ARRAY['wisdom', 'reality', 'learning'], true, false, 135, 20, NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440000', 'The same sun that melts the wax hardens the clay', 'Circumstances affect people differently', 'Explains individual responses to situations', 'South Africa', 'English', ARRAY['perspective', 'individuality', 'circumstances'], true, false, 145, 22, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440001', 'A man who uses force is afraid of reasoning', 'Aggression masks fear of rational discussion', 'Promotes peaceful dialogue over force', 'Morocco', 'Arabic', ARRAY['peace', 'reason', 'communication'], true, false, 155, 24, NOW() - INTERVAL '1 day'),

-- Final batch to reach comprehensive coverage
('550e8400-e29b-41d4-a716-446655440002', 'The wealth of the wise is in their tongues', 'True wealth is in wisdom and communication', 'Values intellectual and verbal skills', 'Egypt', 'Arabic', ARRAY['wisdom', 'wealth', 'communication'], true, false, 165, 26, NOW() - INTERVAL '20 hours'),
('550e8400-e29b-41d4-a716-446655440003', 'He who learns, teaches', 'Knowledge should be shared', 'Encourages teaching and mentorship', 'Tunisia', 'Arabic', ARRAY['knowledge', 'teaching', 'sharing'], true, false, 175, 28, NOW() - INTERVAL '16 hours'),
('550e8400-e29b-41d4-a716-446655440004', 'The house of a person is his or her coffin', 'Life is temporary, prepare for the end', 'Reminds of mortality and preparation', 'Algeria', 'Arabic', ARRAY['life', 'death', 'preparation'], true, false, 185, 30, NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440005', 'A good name is better than good oil', 'Reputation is more valuable than material wealth', 'Prioritizes character over possessions', 'Libya', 'Arabic', ARRAY['reputation', 'character', 'values'], true, false, 195, 32, NOW() - INTERVAL '8 hours'),
('550e8400-e29b-41d4-a716-446655440006', 'The envious person is a person with two bellies', 'Envy consumes and destroys from within', 'Warns against the destructive nature of envy', 'Morocco', 'Arabic', ARRAY['envy', 'destruction', 'character'], true, false, 205, 34, NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440007', 'Silence is the best answer to the stupid', 'Do not engage with foolishness', 'Advises selective engagement in discourse', 'Egypt', 'Arabic', ARRAY['wisdom', 'silence', 'discernment'], true, false, 215, 36, NOW() - INTERVAL '2 hours'),

-- Final proverbs for comprehensive collection
('550e8400-e29b-41d4-a716-446655440000', 'The mouth is the door of words', 'Words come from within a person', 'Emphasizes personal responsibility for speech', 'Senegal', 'Wolof', ARRAY['speech', 'responsibility', 'communication'], true, false, 225, 38, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'A good deed is never lost', 'Kindness and good actions have lasting impact', 'Encourages altruism and positive actions', 'Mali', 'Bambara', ARRAY['kindness', 'impact', 'goodness'], true, false, 235, 40, NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440002', 'The heart of a fool is in his mouth, the mouth of a wise man is in his heart', 'Fools speak without thinking, wise people think before speaking', 'Contrasts impulsive vs thoughtful communication', 'Burkina Faso', 'Mossi', ARRAY['wisdom', 'speech', 'thoughtfulness'], true, false, 245, 42, NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440003', 'He who has never traveled thinks that his mother is the only cook', 'Experience broadens perspective', 'Encourages exploration and learning from others', 'Ghana', 'Akan', ARRAY['experience', 'perspective', 'learning'], true, false, 255, 44, NOW() - INTERVAL '10 minutes'),
('550e8400-e29b-41d4-a716-446655440004', 'The lizard that jumped from the high iroko tree to the ground said he would praise himself if no one else did', 'Self-praise is no praise', 'Warns against self-aggrandizement', 'Nigeria', 'Yoruba', ARRAY['humility', 'praise', 'self-worth'], true, false, 265, 46, NOW() - INTERVAL '5 minutes');

-- Create some sample badges for the platform
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('Proverbs Contributor', 'Contributed 10 proverbs to the platform', '📚', 'proverbs_count', 10),
('Wisdom Seeker', 'Viewed 100 proverbs', '🔍', 'views_count', 100),
('Community Builder', 'Earned 500 points through community engagement', '🤝', 'points', 500),
('Cultural Ambassador', 'Shared proverbs from 5 different countries', '🌍', 'countries_count', 5),
('Knowledge Sharer', 'Received 50 likes on contributed proverbs', '❤️', 'likes_received', 50);

-- Assign some badges to users
INSERT INTO public.user_badges (user_id, badge_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM public.badges WHERE name = 'Proverbs Contributor')),
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM public.badges WHERE name = 'Community Builder')),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.badges WHERE name = 'Proverbs Contributor')),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.badges WHERE name = 'Wisdom Seeker')),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.badges WHERE name = 'Cultural Ambassador'));

-- Add some sample comments and likes to demonstrate platform activity
INSERT INTO public.comments (proverb_id, user_id, text) VALUES
((SELECT id FROM public.proverbs WHERE proverb = 'Umuntu ngumuntu ngabantu' LIMIT 1), '550e8400-e29b-41d4-a716-446655440004', 'This proverb captures the essence of Ubuntu philosophy beautifully!'),
((SELECT id FROM public.proverbs WHERE proverb = 'Haba na haba hujaza kibaba' LIMIT 1), '550e8400-e29b-41d4-a716-446655440005', 'Such a powerful reminder of the value of consistent effort.'),
((SELECT id FROM public.proverbs WHERE proverb = 'Se wo were fi na wosan kofa a yennkyi' LIMIT 1), '550e8400-e29b-41d4-a716-446655440006', 'Choose your company wisely - timeless wisdom!');

INSERT INTO public.likes (proverb_id, user_id) VALUES
((SELECT id FROM public.proverbs WHERE proverb = 'Umuntu ngumuntu ngabantu' LIMIT 1), '550e8400-e29b-41d4-a716-446655440004'),
((SELECT id FROM public.proverbs WHERE proverb = 'Umuntu ngumuntu ngabantu' LIMIT 1), '550e8400-e29b-41d4-a716-446655440005'),
((SELECT id FROM public.proverbs WHERE proverb = 'Haba na haba hujaza kibaba' LIMIT 1), '550e8400-e29b-41d4-a716-446655440006'),
((SELECT id FROM public.proverbs WHERE proverb = 'Se wo were fi na wosan kofa a yennkyi' LIMIT 1), '550e8400-e29b-41d4-a716-446655440007');

-- Create a sample collection
INSERT INTO public.collections (user_id, title, description, is_public) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Wisdom of the Elders', 'A curated collection of profound African proverbs about wisdom and life lessons', true);

-- Add some proverbs to the collection
INSERT INTO public.collection_items (collection_id, proverb_id) VALUES
((SELECT id FROM public.collections WHERE title = 'Wisdom of the Elders'),
 (SELECT id FROM public.proverbs WHERE proverb = 'Umuntu ngumuntu ngabantu' LIMIT 1)),
((SELECT id FROM public.collections WHERE title = 'Wisdom of the Elders'),
 (SELECT id FROM public.proverbs WHERE proverb = 'Haba na haba hujaza kibaba' LIMIT 1)),
((SELECT id FROM public.collections WHERE title = 'Wisdom of the Elders'),
 (SELECT id FROM public.proverbs WHERE proverb = 'Se wo were fi na wosan kofa a yennkyi' LIMIT 1));

COMMIT;