import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TutorService } from 'src/app/core/services/tutor.service';
import { Tutor } from 'src/app/shared/models/tutor.model';

@Component({
  selector: 'app-tutores',
  templateUrl: './tutores.component.html',
  styleUrls: ['./tutores.component.css']
})
export class TutoresComponent implements OnInit {
  tutores: Tutor[] = [];
  colunas = ['nome', 'cpf', 'telefone', 'email', 'total_animais', 'acoes'];
  loading = false;
  mostrarFormulario = false;
  editando: Tutor | null = null;
  form: FormGroup;

  constructor(
    private tutorService: TutorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(search?: string): void {
    this.loading = true;
    this.tutorService.listar(search).subscribe({
      next: res => {
        this.tutores = res.results;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirFormulario(tutor?: Tutor): void {
    this.editando = tutor || null;
    this.mostrarFormulario = true;
    if (tutor) {
      this.form.patchValue(tutor);
    } else {
      this.form.reset();
    }
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.editando = null;
    this.form.reset();
  }

  salvar(): void {
    if (this.form.invalid) return;

    const dados = this.form.value;

    if (this.editando?.id) {
      this.tutorService.atualizar(this.editando.id, dados).subscribe({
        next: () => {
          this.snackBar.open('Tutor atualizado!', 'Fechar', { duration: 3000 });
          this.fecharFormulario();
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 3000 })
      });
    } else {
      this.tutorService.criar(dados).subscribe({
        next: () => {
          this.snackBar.open('Tutor cadastrado!', 'Fechar', { duration: 3000 });
          this.fecharFormulario();
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao cadastrar.', 'Fechar', { duration: 3000 })
      });
    }
  }

  deletar(id: number): void {
    if (!confirm('Deseja excluir este tutor?')) return;
    this.tutorService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Tutor excluído!', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: () => this.snackBar.open('Erro ao excluir.', 'Fechar', { duration: 3000 })
    });
  }

  buscar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.carregar(valor);
  }
}
