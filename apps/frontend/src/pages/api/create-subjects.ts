import 'isomorphic-unfetch';
import faker from 'faker';

export default async (req, res) => {
  const subjects = new Array(20).fill(0).map(() => ({
    title: faker.lorem.sentence(),
    speakers: ['8b8cee60-4ff8-4a23-87a9-4fcd3f077fb1'],
    description: faker.lorem.lines(),
    duration: 10 + Math.round(Math.random() * 110),
    language: faker.random.arrayElement(['FR', 'EN']),
    comment: faker.lorem.lines(),
    status: faker.random.arrayElement(['AVAILABLE', 'UNAVAILABLE', 'DONE']),
  }));

  try {
    await Promise.all(
      subjects.map((subject) => {
        fetch('http://localhost:8080/subjects', {
          headers: {
            'content-type': 'application/json',
            Cookie: '',
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
