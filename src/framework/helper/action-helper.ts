import { test, expect } from '@playwright/test';
import { Locator } from '@playwright/test';



export class ActionHelper {


    public async fill(locator: Locator, value: string): Promise<void> {
        await locator.fill(value);
    }

    public async click(locator: Locator): Promise<void> {
        await locator.click();
    }

    public async getText(locator: Locator): Promise<string | null> {
        return await locator.textContent();
    }

    public async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    public async isEnabled(locator: Locator): Promise<boolean> {
        return await locator.isEnabled();
    }

    public async isDisabled(locator: Locator): Promise<boolean> {
        return await locator.isDisabled();
    }   

    public async isChecked(locator: Locator     ): Promise<boolean> {
        return await locator.isChecked();
    }

    public async isSelected(locator: Locator): Promise<boolean> {
        return await locator.evaluate((element) => !!(element as any).selected);
    }

    public async isEditable(locator: Locator): Promise<boolean> {
        return await locator.isEditable();
    }

    public async isHidden(locator: Locator): Promise<boolean> {
        return await locator.isHidden();
    }

    public async isFocused(locator: Locator): Promise<boolean> {
        return await locator.evaluate((element) => element === document.activeElement);
    }

    public async isPresent(locator: Locator): Promise<boolean> {
        return (await locator.count()) > 0;
    }

    public async isNotPresent(locator: Locator): Promise<boolean> {
        return (await locator.count()) === 0;
    }


    public async isVisibleWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        return await locator.isVisible({ timeout: timeout });
    }

    public async isEnabledWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        return await locator.isEnabled({ timeout: timeout });
    }

    public async isDisabledWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        return await locator.isDisabled({ timeout: timeout });
    }

    public async isCheckedWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        return await locator.isChecked({ timeout: timeout });
    }

    public async isEditableWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        return await locator.isEditable({ timeout: timeout });
    }

    public async isHiddenWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        return await locator.isHidden({ timeout: timeout });
    }

    public async isFocusedWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'attached', timeout: timeout });
            return await locator.evaluate((element) => element === document.activeElement);
        } catch {
            return false;
        }
    }

    public async isPresentWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'attached', timeout: timeout });
            return true;
        } catch {
            return false;
        }
    }

    public async isNotPresentWithTimeout(locator: Locator, timeout: number): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'detached', timeout: timeout });
            return true;
        } catch {
            return false;
        }
    }

    public async waitForVisible(locator: Locator, timeout: number): Promise<void> {
        await expect(locator).toBeVisible({ timeout });
    }

    public async waitForEnabled(locator: Locator, timeout: number): Promise<void> {
        await expect(locator).toBeEnabled({ timeout });
    }

    public async waitForDisabled(locator: Locator, timeout: number): Promise<void> {
        await expect(locator).toBeDisabled({ timeout });
    }

    public async waitForChecked(locator: Locator, timeout: number): Promise<void> {
        await expect(locator).toBeChecked({ timeout });
    }

    public async waitForEditable(locator: Locator, timeout: number): Promise<void> {
        await expect(locator).toBeEditable({ timeout });
    }

    public async clear(locator: Locator): Promise<void> {
        await locator.clear();
    }

    public async selectOption(locator: Locator, value: string): Promise<void> {
        await locator.selectOption(value);
    }

    public async hover(locator: Locator): Promise<void> {
        await locator.hover();
    }

    public async doubleClick(locator: Locator): Promise<void> {
        await locator.dblclick();
    }

    public async rightClick(locator: Locator): Promise<void> {
        await locator.click({ button: 'right' });
    }

    public async dragAndDrop(sourceLocator: Locator, targetLocator: Locator): Promise<void> {
        await sourceLocator.dragTo(targetLocator);
    }

    public async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    public async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
        return await locator.getAttribute(attributeName);
    }

    public async fileUpload(locator: Locator, filePath: string): Promise<void> {
        await locator.setInputFiles(filePath);
    }

    public async multiFileUpload(locator: Locator, filePaths: string[]): Promise<void> {
        await locator.setInputFiles(filePaths);
    }

    public async multiSelectOption(locator: Locator, values: string[]): Promise<void> {
        await locator.selectOption(values);
    }


        
}