import { useMemo } from "react";

export const useStatistics = (books) => {
  return useMemo(() => {
    const currentDate = new Date();
    const readBooks = books.filter((book) => book.shelf === "read");

    // Get all reading dates from all books
    const allReadingDates = [];
    readBooks.forEach((book) => {
      if (book.readingDates && book.readingDates.length > 0) {
        book.readingDates.forEach((dateRange) => {
          if (dateRange.dateFinished) {
            allReadingDates.push({
              ...book,
              dateFinished: dateRange.dateFinished,
            });
          }
        });
      } else if (book.dateFinished) {
        // Legacy support for old single date format
        allReadingDates.push(book);
      }
    });

    // Monthly stats for past 12 months
    const monthlyStats = [];
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;

      const monthBooks = allReadingDates.filter((book) => {
        const finishDate = new Date(book.dateFinished);
        return (
          finishDate.getFullYear() === year &&
          finishDate.getMonth() + 1 === month
        );
      });

      const monthLabel = targetDate.toLocaleDateString("en", {
        month: "short",
        year: "2-digit",
      });

      monthlyStats.push({
        month: monthLabel,
        books: monthBooks.length,
        pages: monthBooks.reduce((sum, book) => sum + book.pages, 0),
      });
    }

    // Yearly stats
    const yearlyStats = {};
    allReadingDates.forEach((book) => {
      const year = new Date(book.dateFinished).getFullYear();
      if (!yearlyStats[year]) {
        yearlyStats[year] = { books: 0, pages: 0 };
      }
      yearlyStats[year].books++;
      yearlyStats[year].pages += book.pages;
    });

    const yearlyData = Object.entries(yearlyStats)
      .map(([year, data]) => ({
        year: parseInt(year),
        ...data,
      }))
      .sort((a, b) => a.year - b.year);

    // Format distribution by year
    const formatYearlyStats = {};
    allReadingDates.forEach((book) => {
      const year = new Date(book.dateFinished).getFullYear();
      if (!formatYearlyStats[year]) {
        formatYearlyStats[year] = { ebook: 0, audiobook: 0 };
      }
      formatYearlyStats[year][book.form]++;
    });

    const formatYearlyData = Object.entries(formatYearlyStats)
      .map(([year, data]) => ({
        year: parseInt(year),
        ...data,
      }))
      .sort((a, b) => a.year - b.year);

    // Format distribution by past 12 months
    const formatMonthlyStats = [];
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;

      const monthBooks = allReadingDates.filter((book) => {
        const finishDate = new Date(book.dateFinished);
        return (
          finishDate.getFullYear() === year &&
          finishDate.getMonth() + 1 === month
        );
      });

      const formatCounts = { ebook: 0, audiobook: 0 };
      monthBooks.forEach((book) => {
        formatCounts[book.form]++;
      });

      const monthLabel = targetDate.toLocaleDateString("en", {
        month: "short",
        year: "2-digit",
      });

      formatMonthlyStats.push({
        month: monthLabel,
        ...formatCounts,
      });
    }

    // Tag statistics
    const tagStats = {};
    readBooks.forEach((book) => {
      if (book.tags && book.tags.length > 0) {
        book.tags.forEach((tag) => {
          tagStats[tag] = (tagStats[tag] || 0) + 1;
        });
      }
    });

    const tagData = Object.entries(tagStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ name: tag, value: count }));

    // Calculate current year stats (for the overview cards)
    const currentYear = currentDate.getFullYear();
    const currentYearBooks = allReadingDates.filter((book) => {
      const finishDate = new Date(book.dateFinished);
      return finishDate.getFullYear() === currentYear;
    }).length;

    const currentYearPages = allReadingDates
      .filter((book) => {
        const finishDate = new Date(book.dateFinished);
        return finishDate.getFullYear() === currentYear;
      })
      .reduce((sum, book) => sum + book.pages, 0);

    // Average pages per year
    const avgPagesPerYear =
      yearlyData.length > 0
        ? Math.round(
            yearlyData.reduce((sum, year) => sum + year.pages, 0) /
              yearlyData.length
          )
        : 0;

    return {
      monthly: monthlyStats,
      yearly: yearlyData,
      formatYearly: formatYearlyData,
      formatMonthly: formatMonthlyStats,
      tags: tagData,
      totalRead: allReadingDates.length,
      totalPages: allReadingDates.reduce((sum, book) => sum + book.pages, 0),
      currentYearBooks,
      currentYearPages,
      avgPagesPerYear,
    };
  }, [books]);
};
