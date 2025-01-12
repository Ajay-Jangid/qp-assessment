import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grocery } from './entities/grocery.entity';

@Injectable()
export class GroceryService {
    constructor(
        @InjectRepository(Grocery)
        private groceryRepository: Repository<Grocery>,
    ) { }

    async addGrocery(grocery: Grocery): Promise<Grocery> {
        try {
            return await this.groceryRepository.save(grocery);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const duplicateName = this.extractDuplicateName(error.message);
                throw new BadRequestException(
                    `Grocery item with name "${duplicateName}" already exists.`,
                );
            }
            throw error;
        }
    }

    async addGroceries(groceries: Grocery[]): Promise<Grocery[]> {
        try {
            return await this.groceryRepository.save(groceries);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const duplicateName = this.extractDuplicateName(error.message);
                throw new BadRequestException(
                    `Grocery item with name "${duplicateName}" already exists.`,
                );
            }
            throw error;
        }
    }

    private extractDuplicateName(errorMessage: string): string {
        const match = errorMessage.match(/Duplicate entry '(.+?)' for key/);
        return match ? match[1] : 'unknown';
    }

    async updateGrocery(id: number, grocery: Grocery): Promise<Grocery> {
        try {
            const updateResult = await this.groceryRepository.update(id, grocery);

            // Check if any rows were affected
            if (updateResult.affected === 0) {
                throw new NotFoundException(`Grocery with ID ${id} not found`);
            }

            // Fetch the updated grocery item
            const updatedGrocery = await this.groceryRepository.findOne({ where: { id } });

            return updatedGrocery;
        } catch (err) {
            throw err;
        }
    }

    async removeGrocery(id: number): Promise<void> {
        try {
            const deleteResult = await this.groceryRepository.delete(id);

            // Check if any rows were deleted
            if (deleteResult.affected === 0) {
                throw new NotFoundException(`Grocery with ID ${id} not found`);
            }
        } catch (err) {
            console.error(`[Error in removeGrocery]: ${err.message}`);
            throw new BadRequestException(`Failed to delete grocery with ID ${id}, ${err.message}`);
        }
    }

    async manageInventory(id: number, stock: number): Promise<Grocery> {
        try {
            const updateResult = await this.groceryRepository.update(id, { stock });

            // Check if the update affected any rows
            if (updateResult.affected === 0) {
                throw new NotFoundException(`Grocery with ID ${id} not found`);
            }

            // Fetch and return the updated grocery item
            const updatedGrocery = await this.groceryRepository.findOne({ where: { id } });
            if (!updatedGrocery) {
                throw new NotFoundException(`Grocery with ID ${id} not found after update`);
            }

            return updatedGrocery;
        } catch (err) {
            console.error(`[Error in manageInventory]: ${err.message}`);
            throw new BadRequestException(`Failed to update inventory for grocery with ID ${id},${err.message}`);
        }
    }

    async getAllGroceries(): Promise<Grocery[]> {
        try {
            return await this.groceryRepository.find();
        } catch (err) {
            console.error(`[Error in getAllGroceries]: ${err.message}`);
            throw new BadRequestException('Failed to fetch groceries');
        }
    }
}
