import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  genre?: string;
  description?: string;
  cover_url?: string;
  total_copies: number;
  available_copies: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data as Book[];
    }
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Book | null;
    },
    enabled: !!id
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('books')
        .insert(book)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Success',
        description: 'Book added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Book> & { id: string }) => {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Success',
        description: 'Book updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: 'Success',
        description: 'Book deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
}

export function useBorrowBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ bookId, dueDate }: { bookId: string; dueDate: string }) => {
      if (!user) throw new Error('User must be authenticated');

      // Create borrowing record and update book availability
      const { data: borrowRecord, error: borrowError } = await supabase
        .from('borrowing_records')
        .insert({
          book_id: bookId,
          user_id: user.id,
          due_date: dueDate,
          status: 'borrowed'
        })
        .select()
        .single();
      
      if (borrowError) throw borrowError;

      // Update available copies
      const { data: book } = await supabase
        .from('books')
        .select('available_copies')
        .eq('id', bookId)
        .single();

      if (book && book.available_copies > 0) {
        const { error: updateError } = await supabase
          .from('books')
          .update({ available_copies: book.available_copies - 1 })
          .eq('id', bookId);
        
        if (updateError) throw updateError;
      }
      
      return borrowRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrowing-records'] });
      toast({
        title: 'Success',
        description: 'Book borrowed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
}