import type { Reporter, FullConfig, Suite } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class DynamicFolderReporter implements Reporter {
    private projectName = '';
    private outputBaseDir: string;

    constructor(options: { outputFolder?: string } = {}) {
        this.outputBaseDir = options.outputFolder ?? './playwright-report/default';
    }

    onBegin(config: FullConfig, suite: Suite) {
        // Get project name
        for (const projectSuite of suite.suites) {
            if (!projectSuite.title) continue;
            this.projectName = projectSuite.title;
        }
        // Get timestamp to add into the path
        const timestamp = new Date().toLocaleString().slice(0, 20).replaceAll(', ', '_').replaceAll(':', '-').replaceAll('/', '-').trim();
        const customReportDir = path.join(process.cwd(), this.outputBaseDir, this.projectName, timestamp);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(customReportDir)) {
            fs.mkdirSync(customReportDir, { recursive: true });
        }

        // Share this custom report folder path with the rest of the execution environment
        process.env.PLAYWRIGHT_HTML_OUTPUT_DIR = this.outputBaseDir + '/' + this.projectName + '/' + timestamp;

        console.log(`\n📂 Custom HTML report folder created: ${customReportDir}\n`);
    }
}

export default DynamicFolderReporter;
