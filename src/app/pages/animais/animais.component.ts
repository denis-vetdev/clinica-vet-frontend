import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimalService } from 'src/app/core/services/animal.service';
import { TutorService } from 'src/app/core/services/tutor.service';
import { Animal } from 'src/app/shared/models/animal.model';
import { Tutor } from 'src/app/shared/models/tutor.model';

@Component({
  selector: 'app-animais',
  templateUrl: './animais.component.html',
  styleUrls: ['./animais.component.css']
})
export class AnimaisComponent implements OnInit {
  animais: Animal[] = [];
  tutores: Tutor[] = [];
  colunas = ['nome', 'especie', 'raca', 'tutor_nome', 'nascimento', 'acoes'];
  loading = false;
  mostrarFormulario = false;
  editando: Animal | null = null;
  form: FormGroup;

  especies = [
    { value: 'cao', label: 'Cão' },
    { value: 'gato', label: 'Gato' },
    { value: 'ave', label: 'Ave' },
    { value: 'roedor', label: 'Roedor' },
    { value: 'outro', label: 'Outro' },
  ];

  constructor(
    private animalService: AnimalService,
    private tutorService: TutorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      especie: ['', Validators.required],
      raca: [''],
      nascimento: ['', Validators.required],
      tutor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregar();
    this.tutorService.listar().subscribe(res => this.tutores = res.results);
  }

  carregar(search?: string): void {
    this.loading = true;
    this.animalService.listar(search).subscribe({
      next: res => {
        this.animais = res.results;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirFormulario(animal?: Animal): void {
    this.editando = animal || null;
    this.mostrarFormulario = true;
    if (animal) {
      this.form.patchValue(animal);
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
      this.animalService.atualizar(this.editando.id, dados).subscribe({
        next: () => {
          this.snackBar.open('Animal atualizado!', 'Fechar', { duration: 3000 });
          this.fecharFormulario();
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 3000 })
      });
    } else {
      this.animalService.criar(dados).subscribe({
        next: () => {
          this.snackBar.open('Animal cadastrado!', 'Fechar', { duration: 3000 });
          this.fecharFormulario();
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao cadastrar.', 'Fechar', { duration: 3000 })
      });
    }
  }

  deletar(id: number): void {
    if (!confirm('Deseja excluir este animal?')) return;
    this.animalService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Animal excluído!', 'Fechar', { duration: 3000 });
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
