import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepo.create(createMenuDto);
    return this.menuRepo.save(menu);
  }

  findAll() {
    return this.menuRepo.find();
  }

  async findOne(id: number) {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException(`Menu #${id} not found`);
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    Object.assign(menu, updateMenuDto);
    return this.menuRepo.save(menu);
  }

  async remove(id: number) {
    const result = await this.menuRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Menu #${id} not found`);
    return { message: `Menu #${id} deleted` };
  }
}
