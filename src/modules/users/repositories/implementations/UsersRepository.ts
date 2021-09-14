import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async findUserWithGamesById({ user_id }: IFindUserWithGamesDTO): Promise<User | undefined> {
        // const user = await this.repository.findOne({
        //   where: { id: user_id }
        // });
        // return user;

        const user = this.repository
          .createQueryBuilder("users")
          .leftJoinAndSelect("users.games", "game")
          .where("users.id = :id", { id: user_id })
          .getOne()

        return user;
    }

    async findAllUsersOrderedByFirstName(): Promise<User[]> {
        return this.repository.query("SELECT * FROM users order by first_name asc"); // Complete usando raw query
    }

    async findUserByFullName({ first_name, last_name }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
        return this.repository
        .query(`SELECT first_name, last_name, email FROM users WHERE LOWER(first_name) = LOWER('${first_name}') AND LOWER(last_name) = LOWER('${last_name}')`); // Complete usando raw query
    }
}
