import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    // Show max 5 page buttons
    let visiblePages = pages;
    if (totalPages > 5) {
        if (currentPage <= 3) {
            visiblePages = [...pages.slice(0, 4), -1, totalPages];
        } else if (currentPage >= totalPages - 2) {
            visiblePages = [1, -1, ...pages.slice(totalPages - 4)];
        } else {
            visiblePages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
        }
    }

    return (
        <div className="flex items-center justify-center space-x-2 mt-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {visiblePages.map((page, idx) => (
                page === -1 ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                ) : (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={currentPage === page ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : "text-gray-700"}
                    >
                        {page}
                    </Button>
                )
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
