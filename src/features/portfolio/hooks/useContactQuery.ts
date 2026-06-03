import { useQuery } from '@tanstack/react-query'
import type { Contact } from '../types/Contact'
import contactService, { CONTACTS_KEY } from '../../shared/pages/admin/contact/service/contactService'

export function useContactQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<Contact[]>({
    queryKey: CONTACTS_KEY,
    queryFn: contactService.getAll,
  })

  return {
    contacts: data,
    loading: isLoading,
    fetching: isFetching,
    refetch,
  }
}
