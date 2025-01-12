import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { Grocery } from './entities/grocery.entity';
import { Roles } from '../shared/decorators/roles.decorator'; // Import the Roles decorator
import { UserRole } from 'src/shared/utils/contants';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';

@Controller('admin/grocery')
@UseGuards(AuthorizationGuard, RolesGuard)
export class GroceryController {
    constructor(private readonly groceryService: GroceryService) { }

    @Post('add/grocery')
    @Roles(UserRole.Admin)
    addGrocery(@Body() grocery: Grocery) {
        return this.groceryService.addGrocery(grocery);
    }

    @Post('add/groceries')
    @Roles(UserRole.Admin)
    async addGroceries(@Body() groceries: Grocery[]) {
        return this.groceryService.addGroceries(groceries);
    }

    @Put(':id')
    @Roles(UserRole.Admin)
    updateGrocery(@Param('id') id: number, @Body() grocery: Grocery) {
        return this.groceryService.updateGrocery(id, grocery);
    }

    @Delete(':id')
    @Roles(UserRole.Admin)
    removeGrocery(@Param('id') id: number) {
        return this.groceryService.removeGrocery(id);
    }

    @Put('inventory/:id')
    @Roles(UserRole.Admin)
    manageInventory(@Param('id') id: number, @Body() stock: { stock: number }) {
        return this.groceryService.manageInventory(id, stock.stock);
    }
}

@Controller('grocery')
@UseGuards(AuthorizationGuard, RolesGuard)
export class GroceryUserController {
    constructor(private readonly groceryService: GroceryService) { }

    @Get('/')
    @Roles(UserRole.User, UserRole.Admin) // Both Admin and User can access
    getAllGroceries() {
        try {
            return this.groceryService.getAllGroceries();
        } catch (err) {
            console.log('[Error ::]', err)
        }
    }
}
