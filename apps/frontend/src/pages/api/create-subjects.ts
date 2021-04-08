import 'isomorphic-unfetch';
import faker from 'faker';

import { SubjectLanguage, SubjectStatus } from '@letsshareatoast/shared';

export default async (req, res) => {
  const usersData = await fetch('http://api:3000/users');
  const users = await usersData.json();

  const subjects = new Array(20).fill(0).map(() => ({
    title: faker.lorem.sentence(),
    /// speakers: ['db855e2b-ddb2-4cb2-8662-c351ba58e37f'],
    speakers: [
      ...new Set(
        new Array(Math.floor(Math.random() * users.length - 1))
          .fill(0)
          .map(() => {
            return users[Math.ceil(Math.random() * users.length - 1)].id;
          })
      ),
    ],
    description: faker.lorem.lines(),
    duration: 10 + Math.round(Math.random() * 110),
    language: faker.random.arrayElement([
      SubjectLanguage.EN,
      SubjectLanguage.FR,
    ]),
    comment: faker.lorem.lines(),
    status: faker.random.arrayElement([
      SubjectStatus.AVAILABLE,
      SubjectStatus.UNAVAILABLE,
      SubjectStatus.DONE,
    ]),
  }));

  try {
    await Promise.all(
      subjects.map((subject) => {
        fetch('http://api:3000/subjects', {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(subject),
          method: 'POST',
        });
      })
    );
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(subjects));
};
