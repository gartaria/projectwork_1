import { listAnimalsSchema, deleteAnimalSchema } from './schema';

export default function animalHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listAnimalsSchema },
		async (req, res) => {
			req.log.info('list animals from db');
			const animals = await server.db.animals.find();
			res.send(animals);
		}
	);

	server.get('/:_id', async (req, res) => {
		req.log.info('get one animals from db');
		const animal = await server.db.animals.findOne(req.params._id);
		res.send(animal);
	});

	server.post('/', async (req, res) => {
		req.log.info('Add animals to db');
		const animals = await server.db.animals.save(req.body);
		res.status(201).send(animals);
	});

	server.put('/:_id', async (req, res) => {
		req.log.info('Update animal to db');
		const _id = req.params._id;
		const animals = await server.db.animals.save({ _id, ...req.body });
		res.status(200).send(animals);
	});

	server.delete(
		'/:_id',
		{ schema: deleteAnimalSchema },
		async (req, res) => {
			req.log.info(`delete animal ${req.params._id} from db`);
			const animal = await server.db.animals.findOne(req.params._id);
			await server.db.animals.remove(animal);
			res.code(200).send({});
		}
	);

	next();
}
