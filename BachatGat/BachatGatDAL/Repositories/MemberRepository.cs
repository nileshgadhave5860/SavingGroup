using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace BachatGatDAL.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly AppDbContext _context;

        public MemberRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CreateMemberResponseDto> CreateMember(CreateMemberDto request)
        {
            try
            {
                var transactionId = Guid.NewGuid();

                // Create Member
                var member = new Member
                {
                    SGId = request.SGId,
                    FullName = request.FullName,
                    Address = request.Address,
                    MobileNo = request.MobileNo,
                    Email = request.Email,
                    Password = Encoding.UTF8.GetBytes(request.Password),
                    TotalSaving = request.Deposit,
                    TotalLoan = 0,
                    Deposit = request.Deposit,
                    IsActive = true,
                    PaymentType = request.PaymentType,
                    TransactionId = transactionId
                };

                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                // Create CashAccount or BankAccount based on PaymentType
                if (request.PaymentType == PaymentType.Cash)
                {
                    var cashAccount = new CashAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = $"Member deposit for {request.FullName}",
                        CrAmount = 0,
                        DrAmount = request.Deposit,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };
                    _context.CashAccounts.Add(cashAccount);
                }
                else if (request.PaymentType == PaymentType.Bank)
                {
                    var bankAccount = new BankAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = $"Member deposit for {request.FullName}",
                        CrAmount = 0,
                        DrAmount = request.Deposit,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };
                    _context.BankAccounts.Add(bankAccount);
                }

                await _context.SaveChangesAsync();

                return new CreateMemberResponseDto
                {
                    MemberId = member.MemberId,
                    FullName = member.FullName,
                    TransactionId = transactionId,
                    Success = true,
                    Message = "Member created successfully"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating member: {ex.Message}");
            }
        }

        public async Task<UpdateMemberResponseDto> UpdateMember(UpdateMemberDto request)
        {
            try
            {
                var member = await _context.Members.FirstOrDefaultAsync(m => m.MemberId == request.MemberId);
                if (member == null)
                {
                    return new UpdateMemberResponseDto { Success = false, Message = "Member not found" };
                }

                // Store old PaymentType to check if it changed
                var oldPaymentType = member.PaymentType;

                // Update member details
                member.FullName = request.FullName;
                member.Address = request.Address;
                member.MobileNo = request.MobileNo;
                member.Email = request.Email;
                if(request.Password != null)
                {
 member.Password = Encoding.UTF8.GetBytes(request.Password);
                }
               
                member.PaymentType = request.PaymentType;
                member.Deposit = request.Deposit;
                member.TotalSaving += request.Deposit;
                
                _context.Members.Update(member);
                await _context.SaveChangesAsync();

                // Use existing TransactionId
                var transactionId = member.TransactionId;

                // If payment type is same, update existing account record
                if (oldPaymentType == request.PaymentType)
                {
                    if (request.PaymentType == PaymentType.Cash)
                    {
                        var existingCashAccount = await _context.CashAccounts
                            .FirstOrDefaultAsync(c => c.TransactionId == transactionId);
                        
                        if (existingCashAccount != null)
                        {
                            existingCashAccount.DrAmount = request.Deposit;
                            existingCashAccount.UpdatedDate = DateTime.Now;
                            _context.CashAccounts.Update(existingCashAccount);
                        }
                        else
                        {
                            var cashAccount = new CashAccount
                            {
                                SGId = member.SGId,
                                MonthId = request.MonthId,
                                Particulars = $"Deposit update for {member.FullName}",
                                CrAmount = 0,
                                DrAmount = request.Deposit,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            };
                            _context.CashAccounts.Add(cashAccount);
                        }
                    }
                    else if (request.PaymentType == PaymentType.Bank)
                    {
                        var existingBankAccount = await _context.BankAccounts
                            .FirstOrDefaultAsync(b => b.TransactionId == transactionId);
                        
                        if (existingBankAccount != null)
                        {
                            existingBankAccount.DrAmount = request.Deposit;
                            existingBankAccount.UpdatedDate = DateTime.Now;
                            _context.BankAccounts.Update(existingBankAccount);
                        }
                        else
                        {
                            var bankAccount = new BankAccount
                            {
                                SGId = member.SGId,
                                MonthId = request.MonthId,
                                Particulars = $"Deposit update for {member.FullName}",
                                CrAmount = 0,
                                DrAmount = request.Deposit,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            };
                            _context.BankAccounts.Add(bankAccount);
                        }
                    }
                }
                else
                {
                    // Delete opposite account type if payment type changed
                    if (oldPaymentType == PaymentType.Bank && request.PaymentType == PaymentType.Cash)
                    {
                        // Delete BankAccount with same TransactionId
                        var bankAccounts = await _context.BankAccounts
                            .Where(b => b.TransactionId == transactionId)
                            .ToListAsync();
                        _context.BankAccounts.RemoveRange(bankAccounts);
                    }
                    else if (oldPaymentType == PaymentType.Cash && request.PaymentType == PaymentType.Bank)
                    {
                        // Delete CashAccount with same TransactionId
                        var cashAccounts = await _context.CashAccounts
                            .Where(c => c.TransactionId == transactionId)
                            .ToListAsync();
                        _context.CashAccounts.RemoveRange(cashAccounts);
                    }
                    await _context.SaveChangesAsync();

                    // Create new account with new PaymentType
                    if (request.PaymentType == PaymentType.Cash)
                    {
                        var cashAccount = new CashAccount
                        {
                            SGId = member.SGId,
                            MonthId = request.MonthId,
                            Particulars = $"Deposit update for {member.FullName}",
                            CrAmount = 0,
                            DrAmount = request.Deposit,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            TransactionId = transactionId
                        };
                        _context.CashAccounts.Add(cashAccount);
                    }
                    else if (request.PaymentType == PaymentType.Bank)
                    {
                        var bankAccount = new BankAccount
                        {
                            SGId = member.SGId,
                            MonthId = request.MonthId,
                            Particulars = $"Deposit update for {member.FullName}",
                            CrAmount = 0,
                            DrAmount = request.Deposit,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            TransactionId = transactionId
                        };
                        _context.BankAccounts.Add(bankAccount);
                    }
                }

                await _context.SaveChangesAsync();

                return new UpdateMemberResponseDto
                {
                    MemberId = member.MemberId,
                    Success = true,
                    Message = "Member updated successfully"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating member: {ex.Message}");
            }
        }

        public async Task<MemberStatusResponseDto> ActivateMember(int memberId)
        {
            try
            {
                var member = await _context.Members.FirstOrDefaultAsync(m => m.MemberId == memberId);
                if (member == null)
                {
                    return new MemberStatusResponseDto
                    {
                        MemberId = memberId,
                        Success = false,
                        Message = "Member not found"
                    };
                }

                member.IsActive = true;
                _context.Members.Update(member);
                await _context.SaveChangesAsync();

                return new MemberStatusResponseDto
                {
                    MemberId = member.MemberId,
                    IsActive = member.IsActive,
                    Success = true,
                    Message = "Member activated successfully"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error activating member: {ex.Message}");
            }
        }

        public async Task<MemberStatusResponseDto> DeactivateMember(int memberId)
        {
            try
            {
                var member = await _context.Members.FirstOrDefaultAsync(m => m.MemberId == memberId);
                if (member == null)
                {
                    return new MemberStatusResponseDto
                    {
                        MemberId = memberId,
                        Success = false,
                        Message = "Member not found"
                    };
                }

                member.IsActive = false;
                _context.Members.Update(member);
                await _context.SaveChangesAsync();

                return new MemberStatusResponseDto
                {
                    MemberId = member.MemberId,
                    IsActive = member.IsActive,
                    Success = true,
                    Message = "Member deactivated successfully"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deactivating member: {ex.Message}");
            }
        }

        public async Task<MemberLoginResponseDto> Authenticate(MemberLoginDto request)
        {
            try
            {
                var member = await _context.Members.FirstOrDefaultAsync(m => m.MobileNo == request.MobileNo && m.SGId == request.SGId && m.IsActive == true);
                if (member == null)
                {
                    return new MemberLoginResponseDto { Success = false, Message = "Invalid credentials" };
                }

                var provided = Encoding.UTF8.GetBytes(request.Password ?? string.Empty);
                if (!member.Password.SequenceEqual(provided))
                {
                    return new MemberLoginResponseDto { Success = false, Message = "Invalid credentials" };
                }

                var latestMonth = await _context.MonthMasters.Where(m => m.SGId == member.SGId)
                    .OrderByDescending(m => m.Createddate)
                    .FirstOrDefaultAsync();

                return new MemberLoginResponseDto
                {
                    MemberId = member.MemberId,
                    SGId = member.SGId,
                    MemberName = member.FullName,
                    MonthId = latestMonth?.MonthId ?? 0,
                    Success = true,
                    Message = "Authenticated"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error authenticating member: {ex.Message}");
            }
        }

        public async Task<GetMemberBySGIdResponseDto> GetMemberDataBySGId(int sgId)
        {
            try
            {
                var members = await _context.Members
                    .Where(m => m.SGId == sgId)
                    .Select(m => new MemberBySGIdDto
                    {
                        MemberId = m.MemberId,
                        FullName = m.FullName,
                        Address = m.Address,
                        MobileNo = m.MobileNo,
                        Email = m.Email,
                        TotalSaving = m.TotalSaving,
                        TotalLoan = m.TotalLoan,
                        Deposit = m.Deposit,
                        IsActive = m.IsActive,
                        PaymentType = m.PaymentType
                    })
                    .ToListAsync();

                if (members == null || members.Count == 0)
                {
                    return new GetMemberBySGIdResponseDto
                    {
                        Members = new List<MemberBySGIdDto>(),
                        Success = false,
                        Message = "No members found for the given Saving Group ID"
                    };
                }

                return new GetMemberBySGIdResponseDto
                {
                    Members = members,
                    Success = true,
                    Message = $"Retrieved {members.Count} member(s) successfully"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving members: {ex.Message}");
            }
        }
    }
}
