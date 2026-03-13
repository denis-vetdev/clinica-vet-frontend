import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VeterinarioService } from 'src/app/core/services/veterinario.service';
import { Veterinario } from 'src/app/shared/models/veterinario.model';

@Component({
  selector: 'app-veterinarios',
  templateUrl: './veterinarios.component.html',
  styleUrls: ['./veterinarios.component.css']
})
export class VeterinariosComponent implements OnInit {
  veterinarios: Veterinario[] = [];
  colunas = ['nome', 'crmv', 'especialidade', 'email', 'ativo', 'acoes'];
  loading = false;
  mostrarFormulario = false;
  editando: Veterinario | null = null;
  form: FormGroup;

  constructor(
    private veterinarioService: VeterinarioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      crmv: ['', Validators.required],
      especialidade: ['', Validators.required],
      telefone: [''],
      email: ['', [Validators.required, Validators.email]],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(search?: string): void {
    this.loading = true;
    this.veterinarioService.listar(search).subscribe({
      next: res => {
        this.veterinarios = res.results;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirFormulario(vet?: Veterinario): void {
    this.editando = vet || null;
    this.mostrarFormulario = true;
    if (vet) {
      this.form.patchValue(vet);
    } else {
      this.form.reset({ ativo: true });
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
      this.veterinarioService.atualizar(this.editando.id, dados).subscribe({
        next: () => {
          this.snackBar.open('Veterinário atualizado!', 'Fechar', { duration: 3000 });
          this.fecharFormulario();
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 3000 })
      });
    } else {
      this.veterinarioService.criar(dados).subscribe({
        next: () => {
          this.snackBar.open('Veterinário cadastrado!', 'Fechar', { duration: 3000 });
          this.fecharFormulario();
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao cadastrar.', 'Fechar', { duration: 3000 })
      });
    }
  }

  deletar(id: number): void {
    if (!confirm('Deseja excluir este veterinário?')) return;
    this.veterinarioService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Veterinário excluído!', 'Fechar', { duration: 3000 });
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
