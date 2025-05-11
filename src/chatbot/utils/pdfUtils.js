"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllPDFs = exports.extractTextFromPDF = void 0;
var fs = require("fs");
var path = require("path");
var pdfParse = require('pdf-parse');
/**
 * Function to extract text from a PDF file
 * @param filePath - The file path of the PDF
 * @returns {Promise<string>}
 */
var extractTextFromPDF = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var dataBuffer, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                dataBuffer = fs.readFileSync(filePath);
                return [4 /*yield*/, pdfParse(dataBuffer)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data.text];
            case 2:
                error_1 = _a.sent();
                console.error('Error reading PDF:', error_1);
                throw new Error("Failed to extract text from PDF: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.extractTextFromPDF = extractTextFromPDF;
/**
 * Function to load all PDF files from a folder
 * @param folderPath - The folder path to load PDFs from
 * @returns {Promise<string[]>} - A list of texts extracted from all PDFs
 */
var loadAllPDFs = function (folderPath) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, files, pdfFiles, pdfTexts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Check if folder exists
                if (!fs.existsSync(folderPath)) {
                    throw new Error("Folder does not exist: ".concat(folderPath));
                }
                stats = fs.statSync(folderPath);
                if (!stats.isDirectory()) {
                    throw new Error("Path is not a directory: ".concat(folderPath));
                }
                files = fs.readdirSync(folderPath);
                pdfFiles = files.filter(function (file) { return path.extname(file).toLowerCase() === '.pdf'; });
                if (pdfFiles.length === 0) {
                    console.warn("No PDF files found in directory: ".concat(folderPath));
                    return [2 /*return*/, []];
                }
                return [4 /*yield*/, Promise.all(pdfFiles.map(function (pdfFile) { return __awaiter(void 0, void 0, void 0, function () {
                        var pdfFilePath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pdfFilePath = path.join(folderPath, pdfFile);
                                    return [4 /*yield*/, (0, exports.extractTextFromPDF)(pdfFilePath)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }))];
            case 1:
                pdfTexts = _a.sent();
                return [2 /*return*/, pdfTexts.filter(function (text) { return text.trim().length > 0; })];
            case 2:
                error_2 = _a.sent();
                console.error('Error loading PDFs:', error_2);
                throw new Error("Failed to load PDFs: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.loadAllPDFs = loadAllPDFs;
