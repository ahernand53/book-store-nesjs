import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReadBookDto, UpdateBookDto } from './dtos';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { GetUser } from '../auth/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Book Endpoints')
@Controller('books')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this._bookService.get(bookId);
  }

  @Get('/author/:authId')
  getBooksByAuthor(
    @Param('authId', ParseIntPipe) authId: number,
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBookByAuthor(authId);
  }

  @Get()
  getBooks(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: CreateBookDto): Promise<ReadBookDto> {
    return this._bookService.create(book);
  }

  @Post('/own')
  @ApiBearerAuth('swagger')
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBookByAuthor(
    @Body() book: CreateBookDto,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.createByAuthor(authorId, book);
  }

  @Patch(':bookId')
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiBearerAuth('swagger')
  updateBook(
    @Param('bookId') bookId: number,
    @Body() book: UpdateBookDto,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.update(authorId, bookId, book);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth('swagger')
  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: number): Promise<void> {
    return this._bookService.delete(bookId);
  }
}
