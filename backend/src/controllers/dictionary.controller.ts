import { Request, Response } from "express";
import { DikiScraper } from "../scrapers/diki.scraper";
import { InterslavicTranslator } from "../scrapers/interslavic.translator";
import { Language, SupportedLanguages } from "../types/languages.type";
import { SearchResult } from "../types/search.type";

export namespace DictionaryController {
  export async function search(req: Request<{ word: string }, {}, {} , { from: Language, to: Language }>, res: Response) {
    const { word } = req.params;
    const { from, to } = req.query;

    if ((from && !SupportedLanguages.includes(from)) || (to && !SupportedLanguages.includes(to))) {     
      return res.status(400).json({
        status: 400,
        message: 'Unsupported language'
      });
    }

    if (!req.params.word) {
      return res.status(200).json({
        status: 200,
        data: []
      })
    }

    return res.status(200).json({
      status: 200,
      data: await get_search_results(word, from, to),
    });
  }

  async function get_search_results(word: string, from?: Language, to?: Language) {
    const results: SearchResult[] = [];

    if (from && to && from === to) {
      return [];
    }

    results.push(...(await DikiScraper.search(word, from, to)));
    results.push(...(await InterslavicTranslator.translate(word, from, to)));

    return results;
  }
}
