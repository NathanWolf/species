insert into answer (answer) values ('yes');
insert into answer (answer) values ('no');
insert into answer (answer) values ('not sure');

insert into species (name, common_name) values ('Ladybird Beetle', 'Ladybug');
insert into species (name) values ('Cockroach');
insert into species (name) values ('Tarantula');
insert into species (name) values ('Honeybee');

insert into question (question) values ('Does it have 6 legs?');
insert into question (question) values ('Does it have wings?');
insert into question (question) values ('Does it sting?');
insert into question (question) values ('Does it have spots?');

insert into question_answer(species_id, question_id, answer_id) values (1, 1, 1);
insert into question_answer(species_id, question_id, answer_id) values (1, 2, 1);
insert into question_answer(species_id, question_id, answer_id) values (1, 3, 2);
insert into question_answer(species_id, question_id, answer_id) values (1, 4, 1);
insert into question_answer(species_id, question_id, answer_id) values (2, 1, 1);
insert into question_answer(species_id, question_id, answer_id) values (2, 2, 1);
insert into question_answer(species_id, question_id, answer_id) values (2, 3, 2);
insert into question_answer(species_id, question_id, answer_id) values (2, 4, 2);
insert into question_answer(species_id, question_id, answer_id) values (3, 1, 2);
insert into question_answer(species_id, question_id, answer_id) values (3, 2, 2);
insert into question_answer(species_id, question_id, answer_id) values (3, 3, 2);
insert into question_answer(species_id, question_id, answer_id) values (3, 4, 2);
insert into question_answer(species_id, question_id, answer_id) values (4, 1, 1);
insert into question_answer(species_id, question_id, answer_id) values (4, 2, 1);
insert into question_answer(species_id, question_id, answer_id) values (4, 3, 1);
insert into question_answer(species_id, question_id, answer_id) values (4, 4, 2);