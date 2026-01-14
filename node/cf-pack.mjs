import {cp, mkdir, readdir, rm, stat} from "node:fs/promises";
import path from "node:path";

const DIST_DIR = "dist";
const ROOT_DIR = process.cwd();

const copyPath = async (src, dest) => {
	await mkdir(path.dirname(dest), {recursive: true});
	await rm(dest, {force: true, recursive: true});
	await cp(src, dest, {recursive: true});
};

const exists = async (target) => {
	try {
		await stat(target);
		return true;
	} catch {
		return false;
	}
};

const main = async () => {
	await rm(DIST_DIR, {recursive: true, force: true});
	await mkdir(DIST_DIR, {recursive: true});

	const rootCopies = [
		"sw.js",
		"sw-injector.js",
		"manifest.webmanifest",
	];

	const dirCopies = [
		"css",
		"js",
		"lib",
		"img",
		"fonts",
		"icon",
		"data",
		"search",
	];

	const rootEntries = await readdir(ROOT_DIR, {withFileTypes: true});
	for (const entry of rootEntries) {
		if (!entry.isFile()) continue;
		const ext = path.extname(entry.name);
		if (ext !== ".html" && ext !== ".png" && ext !== ".svg") continue;
		rootCopies.push(entry.name);
	}

	for (const entry of rootCopies) {
		if (!(await exists(entry))) continue;
		await copyPath(entry, path.join(DIST_DIR, entry));
	}

	for (const entry of dirCopies) {
		if (!(await exists(entry))) continue;
		await copyPath(entry, path.join(DIST_DIR, entry));
	}
};

await main();
