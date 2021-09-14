import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
      .createQueryBuilder("games")
      .where("games.title ilike :param", { param: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT count(*) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[] | undefined> {
    const games = await this.repository
      .createQueryBuilder("games")
      .innerJoinAndSelect("games.users", "user")
      .where("games.id = :id", { id: id })
      .getOne();

    const users = games?.users
    return users
  }
}
