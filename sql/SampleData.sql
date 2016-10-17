insert into answer (answer, created) values ('yes', UTC_TIMESTAMP());
insert into answer (answer, created) values ('no', UTC_TIMESTAMP());
insert into answer (answer, created) values ('not sure', UTC_TIMESTAMP());

insert into species (name, common_name, created) values ('Ladybird Beetle', 'Ladybug', UTC_TIMESTAMP());
insert into species (name, created) values ('Cockroach', UTC_TIMESTAMP());
insert into species (name, created) values ('Tarantula', UTC_TIMESTAMP());
insert into species (name, created) values ('Honeybee', UTC_TIMESTAMP());

insert into question (question, created) values ('Does it have 6 legs?', UTC_TIMESTAMP());
insert into question (question, created) values ('Does it have wings?', UTC_TIMESTAMP());
insert into question (question, created) values ('Does it sting?', UTC_TIMESTAMP());
insert into question (question, created) values ('Does it have spots?', UTC_TIMESTAMP());

insert into question_answer(species_id, question_id, answer_id, created) values (1, 1, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (1, 2, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (1, 3, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (1, 4, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (2, 1, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (2, 2, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (2, 3, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (2, 4, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (3, 1, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (3, 2, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (3, 3, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (3, 4, 2, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (4, 1, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (4, 2, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (4, 3, 1, UTC_TIMESTAMP());
insert into question_answer(species_id, question_id, answer_id, created) values (4, 4, 2, UTC_TIMESTAMP());