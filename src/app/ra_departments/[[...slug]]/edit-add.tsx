import { useSearchParams } from '@/router';
import AddNewRiskForm from '../../risks/[[...slug]]/edit-add';

export default function EditAddForm({ title }: { title: string }) {
   const searchParams = useSearchParams()
   return <AddNewRiskForm title={title} action={searchParams.get('action')} />
}