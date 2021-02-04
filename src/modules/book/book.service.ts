import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { BookRepository } from './book.respository';
import { status } from '../../shared/entity-status.num';
import { ReadBookDto, CreateBookDto, UpdateBookDto } from './dtos';
import { plainToClass } from 'class-transformer';
import { Book } from './book.entity';
import { In } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('userId must be send');
    }

    const book = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('Book does not exist');
    }

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      status: status.ACTIVE,
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('authorId must be sent');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE, authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExist = await this._userRepository.findOne(authorId, {
        where: { status: status.ACTIVE },
      });

      if (!authorExist) {
        throw new NotFoundException(
          `There's not an author with this id: ${authorId}`,
        );
      }

      const isAuthor = authorExist.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        );
      }

      authors.push(authorExist);
    }

    const saveBook = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDto, saveBook);
  }

  async createByAuthor(
    authorId: number,
    book: Partial<CreateBookDto>,
  ): Promise<ReadBookDto> {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: status.ACTIVE },
    });

    if (!author) {
      throw new NotFoundException('Author does not exist');
    }

    const isAuthor = author.roles.some((role) => role.name === RoleType.AUTHOR);

    if (!isAuthor) {
      throw new UnauthorizedException(`This user is no an author`);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async update(
    authorId: number,
    bookId: number,
    book: Partial<UpdateBookDto>,
  ): Promise<ReadBookDto> {
    const bookExist = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!bookExist) {
      throw new NotFoundException('This book does not exist');
    }

    const isOwnBook = bookExist.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new UnauthorizedException(`This user isn't the book's author`);
    }

    const updatedBook = await this._bookRepository.update(bookId, book);

    return plainToClass(ReadBookDto, updatedBook);
  }

  async delete(bookId: number): Promise<void> {
    const bookExist = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!bookExist) {
      throw new NotFoundException('This book does not exist');
    }

    await this._bookRepository.update(bookId, { status: status.INACTIVE });
  }
}
